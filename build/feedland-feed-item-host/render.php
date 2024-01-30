<?php
/**
 * @var array    $attributes
 * @var WP_Block $block
 * @var string   $content
 */

if ( ! isset( $block->context['feedland/feed-item'] ) ) {
	return '';
}

$url = parse_url( $block->context['feedland/feed-item']->feedUrl );
$host = $url['host'];

$classes = array();

if ( isset( $attributes['textAlign'] ) ) {
	$classes[] = 'has-text-align-' . $attributes['textAlign'];
}

if ( isset( $attributes['style']['elements']['link']['color']['text'] ) ) {
	$classes[] = 'has-link-color';
}

$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => implode( ' ', $classes ) ) );

if ( isset( $attributes['isLink'] ) && $attributes['isLink'] ) {
	$host = sprintf( '<a href="%1$s">%2$s</a>', esc_url( $host ), esc_html( $host ) );
}

printf(
	'<div %1$s>%2$s</div>',
	$wrapper_attributes,
	$host,
);
