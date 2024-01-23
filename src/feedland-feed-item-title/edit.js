/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import {
	AlignmentControl,
	BlockControls,
	InspectorControls,
	useBlockProps,
	HeadingLevelDropdown,
	useBlockEditingMode,
} from '@wordpress/block-editor';
import { ToggleControl, TextControl, PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function FeedItemTitleEdit( {
	attributes: { level, textAlign, isLink, rel, linkTarget },
	setAttributes,
	context,
} ) {
	const TagName = 'h' + level;

	const blockProps = useBlockProps( {
		className: classnames( {
			[ `has-text-align-${ textAlign }` ]: textAlign,
		} ),
	} );
	const blockEditingMode = useBlockEditingMode();

	let titleElement = (
		<TagName { ...blockProps }>
			{ context[ 'feedland/feed-item' ].title ||
				context[ 'feedland/feed-item' ].description }
		</TagName>
	);

	if ( context[ 'feedland/feed-item' ].title ) {
		titleElement = (
			<TagName
				{ ...blockProps }
				dangerouslySetInnerHTML={ {
					__html: context[ 'feedland/feed-item' ].title,
				} }
			/>
		);
	}

	if ( isLink && context[ 'feedland/feed-item' ].title ) {
		titleElement = (
			<TagName { ...blockProps }>
				<a
					href={ context[ 'feedland/feed-item' ].link }
					target={ linkTarget }
					rel={ rel }
					onClick={ ( event ) => event.preventDefault() }
					dangerouslySetInnerHTML={ {
						__html: context[ 'feedland/feed-item' ].title,
					} }
				/>
			</TagName>
		);
	}

	return (
		<>
			{ blockEditingMode === 'default' && (
				<BlockControls group="block">
					<HeadingLevelDropdown
						value={ level }
						onChange={ ( newLevel ) =>
							setAttributes( { level: newLevel } )
						}
					/>
					<AlignmentControl
						value={ textAlign }
						onChange={ ( nextAlign ) => {
							setAttributes( { textAlign: nextAlign } );
						} }
					/>
				</BlockControls>
			) }
			<InspectorControls>
				<PanelBody title={ __( 'Settings' ) }>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Make title a link' ) }
						onChange={ () => setAttributes( { isLink: ! isLink } ) }
						checked={ isLink }
					/>
					{ isLink && (
						<>
							<ToggleControl
								__nextHasNoMarginBottom
								label={ __( 'Open in new tab' ) }
								onChange={ ( value ) =>
									setAttributes( {
										linkTarget: value ? '_blank' : '_self',
									} )
								}
								checked={ linkTarget === '_blank' }
							/>
							<TextControl
								__nextHasNoMarginBottom
								label={ __( 'Link rel' ) }
								value={ rel }
								onChange={ ( newRel ) =>
									setAttributes( { rel: newRel } )
								}
							/>
						</>
					) }
				</PanelBody>
			</InspectorControls>
			{ titleElement }
		</>
	);
}
