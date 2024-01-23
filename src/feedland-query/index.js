import { registerBlockType } from '@wordpress/blocks';

import './style.scss';

import edit from './edit';
import metadata from './block.json';
import save from './save';
import variations from './variations';

registerBlockType( metadata.name, {
	edit,
	save,
	variations,
} );
