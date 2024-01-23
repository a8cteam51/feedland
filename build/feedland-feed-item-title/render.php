<?php
/**
 * @var array    $attributes
 * @var WP_Block $block
 * @var string   $content
 */

if ( ! isset( $block->context['feedland/feed-item'] ) ) {
	return '';
}

$title = $block->context['feedland/feed-item']->title ?? $block->context['feedland/feed-item']->description;

if ( ! $title ) {
	return '';
}

$tag_name = 'h2';
if ( isset( $attributes['level'] ) ) {
	$tag_name = 'h' . $attributes['level'];
}

if ( isset( $attributes['isLink'] ) && $attributes['isLink'] ) {
	$rel   = ! empty( $attributes['rel'] ) ? 'rel="' . esc_attr( $attributes['rel'] ) . '"' : '';
	$title = sprintf( '<a href="%1$s" target="%2$s" %3$s>%4$s</a>', esc_url( $block->context['feedland/feed-item']->link ), esc_attr( $attributes['linkTarget'] ), $rel, $title );
}

$classes = array();
if ( isset( $attributes['textAlign'] ) ) {
	$classes[] = 'has-text-align-' . $attributes['textAlign'];
}
if ( isset( $attributes['style']['elements']['link']['color']['text'] ) ) {
	$classes[] = 'has-link-color';
}
$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => implode( ' ', $classes ) ) );

printf(
	'<%1$s %2$s>%3$s</%1$s>',
	$tag_name,
	$wrapper_attributes,
	$title
);
