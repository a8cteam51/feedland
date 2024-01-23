<?php
/**
 * @var array    $attributes
 * @var WP_Block $block
 * @var string   $content
 */

if ( ! isset( $block->context['feedland/feed-item'] ) ) {
	return '';
}

$date =  new DateTimeImmutable( $block->context['feedland/feed-item']->pubDate );

$formatted_date   = isset( $attributes['format'] ) ? $date->format( $attributes['format'] ) : $date->format( get_option( 'date_format' ) );
$unformatted_date = esc_attr( $date->format( 'c' ) );
$classes          = array();

if ( isset( $attributes['textAlign'] ) ) {
	$classes[] = 'has-text-align-' . $attributes['textAlign'];
}

if ( isset( $attributes['style']['elements']['link']['color']['text'] ) ) {
	$classes[] = 'has-link-color';
}

$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => implode( ' ', $classes ) ) );

if ( isset( $attributes['isLink'] ) && $attributes['isLink'] ) {
	$formatted_date = sprintf( '<a href="%1s">%2s</a>', esc_url( $block->context['feedland/feed-item']->link ), $formatted_date );
}

printf(
	'<div %1$s><time datetime="%2$s">%3$s</time></div>',
	$wrapper_attributes,
	$unformatted_date,
	$formatted_date
);
