<?php
/**
 * @var array    $attributes
 * @var WP_Block $block
 * @var string   $content
 */

$transient_key = sprintf( 'feedland_%1$s_%2$s', $block->context['feedland/query']['screenName'], $block->context['feedland/query']['category'] );

if ( false === ( $response = get_transient( $transient_key ) ) ) {
	$response = wp_remote_get( sprintf( 'https://feedland.com/getriverfromcategory?screenname=%1$s&catname=%2$s', $block->context['feedland/query']['screenName'], $block->context['feedland/query']['category'] ) );

	if ( wp_remote_retrieve_response_code( $response ) === 500 ) {
		printf(
			'<div class="wp-block-feedland-feedviewer__error">%s</div>',
			esc_html__( 'Error loading feed.', 'feedland' )
		);
		return;
	} else {
		set_transient( $transient_key, $response, MINUTE_IN_SECONDS );
	}
}

$body       = json_decode( wp_remote_retrieve_body( $response ) );
$feed_items = array_slice( array_merge( ...wp_list_pluck( $body->feeds, 'items' ) ), 0, $block->context['feedland/query']['perPage'] );

if ( ! $feed_items ) {
	return '';
}

$classnames = '';
if ( isset( $block->context['displayLayout'] ) && isset( $block->context['feedland/query'] ) ) {
	if ( isset( $block->context['displayLayout']['type'] ) && 'flex' === $block->context['displayLayout']['type'] ) {
		$classnames = "is-flex-container columns-{$block->context['displayLayout']['columns']}";
	}
}
if ( isset( $attributes['style']['elements']['link']['color']['text'] ) ) {
	$classnames .= ' has-link-color';
}

// Ensure backwards compatibility by flagging the number of columns via classname when using grid layout.
if ( isset( $attributes['layout']['type'] ) && 'grid' === $attributes['layout']['type'] && ! empty( $attributes['layout']['columnCount'] ) ) {
	$classnames .= ' ' . sanitize_title( 'columns-' . $attributes['layout']['columnCount'] );
}

$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => trim( $classnames ) ) );

$content = '';

foreach ( $feed_items as $item ) {
	$block_instance = $block->parsed_block;

	// Set the block name to one that does not correspond to an existing registered block.
	// This ensures that for the inner instances of the Post Template block, we do not render any block supports.
	$block_instance['blockName'] = 'core/null';

	$filter_block_context = static function ( $context ) use ( $item ) {
		$context['feedland/feed-item'] = $item;
		return $context;
	};

	// Use an early priority to so that other 'render_block_context' filters have access to the values.
	add_filter( 'render_block_context', $filter_block_context, 1 );
	// Render the inner blocks of the Post Template block with `dynamic` set to `false` to prevent calling
	// `render_callback` and ensure that no wrapper markup is included.
	$block_content = ( new WP_Block( $block_instance ) )->render( array( 'dynamic' => false ) );
	remove_filter( 'render_block_context', $filter_block_context, 1 );

	// Wrap the render inner blocks in a `li` element with the appropriate post classes.
	$post_classes = implode( ' ', get_post_class( 'wp-block-post' ) );

	$content .= '<li class="' . esc_attr( $post_classes ) . '">' . $block_content . '</li>';
}

printf(
	'<ul %1$s>%2$s</ul>',
	$wrapper_attributes,
	$content
);
