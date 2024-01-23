/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useEntityProp, store as coreStore } from '@wordpress/core-data';
import { dateI18n, getSettings as getDateSettings } from '@wordpress/date';
import {
	AlignmentControl,
	BlockControls,
	InspectorControls,
	useBlockProps,
	__experimentalDateFormatPicker as DateFormatPicker,
	__experimentalPublishDateTimePicker as PublishDateTimePicker,
} from '@wordpress/block-editor';
import { ToggleControl, PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function FeedItemDateEdit( {
	attributes: { textAlign, format, isLink },
	context,
	setAttributes,
} ) {
	const blockProps = useBlockProps( {
		className: classnames( {
			[ `has-text-align-${ textAlign }` ]: textAlign,
		} ),
	} );

	const dateSettings = getDateSettings();
	const [ siteFormat = dateSettings.formats.date ] = useEntityProp(
		'root',
		'site',
		'date_format'
	);
	const [ siteTimeFormat = dateSettings.formats.time ] = useEntityProp(
		'root',
		'site',
		'time_format'
	);

	const date = context[ 'feedland/feed-item' ].pubDate || '';

	const dateLabel = __( 'Published Date', 'feedland' );

	let feedItemDate = date ? (
		<time dateTime={ dateI18n( 'c', date ) }>
			{ dateI18n( format || siteFormat, date ) }
		</time>
	) : (
		dateLabel
	);

	if ( isLink && date ) {
		feedItemDate = (
			<a
				href="#feed-item-date-pseudo-link"
				onClick={ ( event ) => event.preventDefault() }
			>
				{ feedItemDate }
			</a>
		);
	}

	return (
		<>
			<BlockControls group="block">
				<AlignmentControl
					value={ textAlign }
					onChange={ ( nextAlign ) => {
						setAttributes( { textAlign: nextAlign } );
					} }
				/>
			</BlockControls>

			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'feedland' ) }>
					<DateFormatPicker
						format={ format }
						defaultFormat={ siteFormat }
						onChange={ ( nextFormat ) =>
							setAttributes( { format: nextFormat } )
						}
					/>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Link to item', 'feedland' ) }
						onChange={ () => setAttributes( { isLink: ! isLink } ) }
						checked={ isLink }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>{ feedItemDate }</div>
		</>
	);
}
