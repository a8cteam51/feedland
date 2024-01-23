<?php
/**
 * @var array    $attributes
 * @var WP_Block $block
 * @var string   $content
 */
if ( ! isset( $block->context['feedland/feed-item'] ) ) {
	return '';
}

$is_link        = isset( $attributes['isLink'] ) && $attributes['isLink'];
$size_slug      = isset( $attributes['sizeSlug'] ) ? $attributes['sizeSlug'] : 'post-thumbnail';
$attr           = get_block_core_post_featured_image_border_attributes( $attributes );
$overlay_markup = get_block_core_post_featured_image_overlay_element_markup( $attributes );
$overlay_markup = str_replace( 'wp-block-post-featured-image__overlay', 'wp-block-feedland-feed-item-enclosure__overlay', $overlay_markup );

if ( $is_link ) {
	if ( isset( $block->context['feedland/feed-item']->title ) ) {
		$attr['alt'] = trim( strip_tags( $block->context['feedland/feed-item']->title ) );
	} else {
		$attr['alt'] = trim( strip_tags( $block->context['feedland/feed-item']->description ) );
	}
}

$extra_styles = '';
// Aspect ratio with a height set needs to override the default width/height.
if ( ! empty( $attributes['aspectRatio'] ) ) {
	$extra_styles .= 'width:100%;height:100%;';
} elseif ( ! empty( $attributes['height'] ) ) {
	$extra_styles .= "height:{$attributes['height']};";
}

if ( ! empty( $attributes['scale'] ) ) {
	$extra_styles .= "object-fit:{$attributes['scale']};";
}

if ( ! empty( $extra_styles ) ) {
	$attr['style'] = empty( $attr['style'] ) ? $extra_styles : $attr['style'] . $extra_styles;
}

$featured_image = isset( $block->context['feedland/feed-item']->enclosure ) && $block->context['feedland/feed-item']->enclosure->type === 'image';

if ( ! $featured_image ) {
	return '';
}

$attrs = array_map( 'esc_attr', $attr );
$html = '';

foreach ( $attr as $name => $value ) {
	$html .= "$name=" . '"' . $value . '"';
}

$featured_image = sprintf(
	'<img src="%1$s" %2$s />',
	esc_url( $block->context['feedland/feed-item']->enclosure->url ),
	$html
);

if ( $is_link ) {
	$link_target    = $attributes['linkTarget'];
	$rel            = ! empty( $attributes['rel'] ) ? 'rel="' . esc_attr( $attributes['rel'] ) . '"' : '';
	$height         = ! empty( $attributes['height'] ) ? 'style="' . esc_attr( safecss_filter_attr( 'height:' . $attributes['height'] ) ) . '"' : '';
	$featured_image = sprintf(
		'<a href="%1$s" target="%2$s" %3$s %4$s>%5$s%6$s</a>',
		esc_url( $block->context['feedland/feed-item']->link ),
		esc_attr( $link_target ),
		$rel,
		$height,
		$featured_image,
		$overlay_markup
	);
} else {
	$featured_image = $featured_image . $overlay_markup;
}

$aspect_ratio = ! empty( $attributes['aspectRatio'] )
	? esc_attr( safecss_filter_attr( 'aspect-ratio:' . $attributes['aspectRatio'] ) ) . ';'
	: '';
$width        = ! empty( $attributes['width'] )
	? esc_attr( safecss_filter_attr( 'width:' . $attributes['width'] ) ) . ';'
	: '';
$height       = ! empty( $attributes['height'] )
	? esc_attr( safecss_filter_attr( 'height:' . $attributes['height'] ) ) . ';'
	: '';
if ( ! $height && ! $width && ! $aspect_ratio ) {
	$wrapper_attributes = get_block_wrapper_attributes();
} else {
	$wrapper_attributes = get_block_wrapper_attributes( array( 'style' => $aspect_ratio . $width . $height ) );
}

echo "<figure {$wrapper_attributes}>{$featured_image}</figure>";
