/**
 * WordPress dependencies
 */
import { title as icon } from '@wordpress/icons';
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';

registerBlockType( metadata.name, {
	icon,
	edit,
} );
