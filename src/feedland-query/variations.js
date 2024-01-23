/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { titleDate, titleExcerpt, imageDateTitle } from './icons';

const QUERY_DEFAULT_ATTRIBUTES = {
	query: {
		perPage: 10,
		screenName: 'dave',
		category: 'all',
	},
};

const variations = [
	{
		name: 'title-only',
		title: __( 'Title Only', 'feedland' ),
		icon: titleDate,
		attributes: { ...QUERY_DEFAULT_ATTRIBUTES },
		innerBlocks: [
			[
				'feedland/feed-template',
				{},
				[ [ 'feedland/feed-item-title' ] ],
			],
		],
		scope: [ 'block' ],
	},
	{
		name: 'title-date',
		title: __( 'Title & Date', 'feedland' ),
		icon: titleExcerpt,
		attributes: { ...QUERY_DEFAULT_ATTRIBUTES },
		innerBlocks: [
			[
				'feedland/feed-template',
				{},
				[
					[ 'feedland/feed-item-title' ],
					[ 'feedland/feed-item-date' ],
				],
			],
		],
		scope: [ 'block' ],
	},
	{
		name: 'title-enclosure-date',
		title: __( 'Title, Enclosure & Date', 'feedland' ),
		icon: imageDateTitle,
		attributes: { ...QUERY_DEFAULT_ATTRIBUTES },
		innerBlocks: [
			[
				'feedland/feed-template',
				{},
				[
					[ 'feedland/feed-item-title' ],
					[ 'feedland/feed-item-enclosure' ],
					[ 'feedland/feed-item-date' ],
				],
			],
		],
		scope: [ 'block' ],
	},
];

export default variations;
