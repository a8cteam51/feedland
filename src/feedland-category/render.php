<?php

/**
 * @var array    $attributes
 * @var WP_Block $block
 * @var string   $content
 */
$transient_key = sprintf( 'feedland_%1$s_%2$s', $attributes['screenname'], $attributes['category'] );

if ( false === ( $response = get_transient( $transient_key ) ) ) {
	$response = wp_remote_get( sprintf( 'https://feedland.com/getriverfromcategory?screenname=%1$s&catname=%2$s', $attributes['screenname'], $attributes['category'] ) );

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
$feed_items = array_slice( array_merge( ...wp_list_pluck( $body->feeds, 'items' ) ), 0, $attributes['itemsToShow'] );
$list_items = '';

foreach ( $feed_items as $item ) {
	$title = esc_html( trim( strip_tags( $item->title ) ) );

	if ( empty( $title ) ) {
		$title = esc_html__( '(no title)', 'feedland' );
	}

	$link = esc_url( $item->link );

	if ( $link ) {
		$title = "<a href='{$link}' target='_blank'>{$title}</a>";
	}

	$title = "<div class='wp-block-feedland-feedviewer__item-title'>{$title}</div>";

	$date = '';
	if ( $attributes['displayDate'] ) {
		$date = strtotime( $item->pubDate );

		if ( $date ) {
			$date = sprintf(
				'<time datetime="%1$s" class="wp-block-feedland-feedviewer__item-publish-date">%2$s</time> ',
				esc_attr( date_i18n( 'c', $date ) ),
				esc_html( date_i18n( get_option( 'date_format' ), $date ) )
			);
		}
	}

	$excerpt = '';
	if ( $attributes['displayExcerpt'] ) {
		$excerpt = html_entity_decode( $item->description, ENT_QUOTES, get_option( 'blog_charset' ) );
		$excerpt = esc_attr( wp_trim_words( $excerpt, $attributes['excerptLength'], ' [&hellip;]' ) );

		// Change existing [...] to [&hellip;].
		if ( '[...]' === substr( $excerpt, -5 ) ) {
			$excerpt = substr( $excerpt, 0, -5 ) . '[&hellip;]';
		}

		$excerpt = '<div class="wp-block-feedland-feedviewer__item-excerpt">' . esc_html( $excerpt ) . '</div>';
	}

	$list_items .= "<li class='wp-block-feedland-feedviewer__item'>{$title}{$date}{$excerpt}</li>";
}

$classnames = array();

if ( isset( $attributes['blockLayout'] ) && 'grid' === $attributes['blockLayout'] ) {
	$classnames[] = 'is-grid';
}

if ( isset( $attributes['columns'] ) && 'grid' === $attributes['blockLayout'] ) {
	$classnames[] = 'columns-' . $attributes['columns'];
}

if ( $attributes['displayDate'] ) {
	$classnames[] = 'has-dates';
}

if ( $attributes['displayExcerpt'] ) {
	$classnames[] = 'has-excerpts';
}

$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => implode( ' ', $classnames ) ) );

printf( '<ul %s>%s</ul>', $wrapper_attributes, $list_items );
