/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';

import './style.scss';

/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';

registerBlockType( metadata.name, {
	edit,
} );
