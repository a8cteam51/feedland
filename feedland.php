<?php
/**
 * Plugin Name:       FeedLand
 * Description:       Displays your FeedLand items.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.2
 * Author:            WordPress.com Special Projects
 * Author URI:        https://wpspecialprojects.wordpress.com
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       feedland
 *
 * @package           feedland
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function feedland_block_init() {
	register_block_type( __DIR__ . '/build/feedland-category' );
	register_block_type( __DIR__ . '/build/feedland-art' );
}
add_action( 'init', 'feedland_block_init' );

/**
 * Skip photon for the bluesky feed.
 *
 * @param bool   $val If we should skip.
 * @param string $src The image source.
 *
 * @return bool
 */
function feedland_photon_exception( $val, $src ) {
	if ( str_contains( $src, 'firesky.tv' ) ) {
		return true;
	}

	return $val;
}
add_filter( 'jetpack_photon_skip_image', 'feedland_photon_exception', 10, 2 );
