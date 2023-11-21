<?php

$transient_key = sprintf( 'feedland_art_%1$s', md5( $attributes['readingListUrl'] ) );

if ( false === ( $response = get_transient( $transient_key ) ) ) {
	$response = wp_remote_get( sprintf( 'https://feedland.com/getriverfromreadinglist?url=%1$s', $attributes['readingListUrl'] ) );

	if ( wp_remote_retrieve_response_code( $response ) === 500 ) {
		printf(
			'<div class="wp-block-feedland-art__error">%s</div>',
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
	$title = esc_html( trim( wp_strip_all_tags( substr( $item->description, 0, strpos( $item->description, '<a' ) ) ) ) );

	if ( empty( $title ) ) {
		$title = esc_html__( '(no title)', 'feedland' );
	}

	$enclosure = '';
	if ( $item->enclosure ) {
		$enclosure = sprintf(
			'<figure class="wp-block-image size-large"><img src="%1$s" alt="%2$s" /><figcaption class="wp-element-caption">%2$s</figcaption></figure>',
			esc_url( $item->enclosure->url ),
			esc_attr( $title ),
			esc_html( $title )
		);
	}

	$list_items .= "{$enclosure}";
}

$wrapper_attributes = get_block_wrapper_attributes();

printf( '<div %1$s><figure class="wp-block-gallery has-nested-images columns-default is-cropped is-layout-flex wp-block-gallery-is-layout-flex">%2$s</figure></div>', $wrapper_attributes, $list_items );
