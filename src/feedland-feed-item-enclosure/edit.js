/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import {
	ToggleControl,
	PanelBody,
	Placeholder,
	TextControl,
} from '@wordpress/components';
import {
	InspectorControls,
	useBlockProps,
	__experimentalUseBorderProps as useBorderProps,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import './editor.scss';
import DimensionControls from './dimension-controls';
import Overlay from './overlay';

const disabledClickProps = {
	onClick: ( event ) => event.preventDefault(),
	'aria-disabled': true,
};

export default function FeedEnclosureEdit( {
	clientId,
	attributes,
	setAttributes,
	context,
} ) {
	const { isLink, aspectRatio, height, width, scale, rel, linkTarget } =
		attributes;

	const mediaUrl = context[ 'feedland/feed-item' ]?.enclosure?.url;

	const blockProps = useBlockProps( {
		style: { width, height, aspectRatio },
	} );
	const borderProps = useBorderProps( attributes );

	const placeholder = ( content ) => {
		return (
			<Placeholder
				className={ classnames(
					'block-editor-media-placeholder',
					borderProps.className
				) }
				withIllustration={ true }
				style={ {
					height: !! aspectRatio && '100%',
					width: !! aspectRatio && '100%',
					...borderProps.style,
				} }
			>
				{ content }
			</Placeholder>
		);
	};

	const controls = (
		<>
			<DimensionControls
				clientId={ clientId }
				attributes={ attributes }
				setAttributes={ setAttributes }
			/>
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'feedland' ) }>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Link to item', 'feedland' ) }
						onChange={ () => setAttributes( { isLink: ! isLink } ) }
						checked={ isLink }
					/>
					{ isLink && (
						<>
							<ToggleControl
								__nextHasNoMarginBottom
								label={ __( 'Open in new tab', 'feedland' ) }
								onChange={ ( value ) =>
									setAttributes( {
										linkTarget: value ? '_blank' : '_self',
									} )
								}
								checked={ linkTarget === '_blank' }
							/>
							<TextControl
								__nextHasNoMarginBottom
								label={ __( 'Link rel', 'feedland' ) }
								value={ rel }
								onChange={ ( newRel ) =>
									setAttributes( { rel: newRel } )
								}
							/>
						</>
					) }
				</PanelBody>
			</InspectorControls>
		</>
	);
	let image;

	const imageStyles = {
		...borderProps.style,
		height: aspectRatio ? '100%' : height,
		width: !! aspectRatio && '100%',
		objectFit: !! ( height || aspectRatio ) && scale,
	};

	image = ! mediaUrl ? (
		placeholder()
	) : (
		<img
			className={ borderProps.className }
			src={ mediaUrl }
			style={ imageStyles }
			alt={
				context[ 'feedland/feed-item' ].descripion ||
				__( 'Featured image', 'feedland' )
			}
		/>
	);

	return (
		<>
			{ controls }
			<figure { ...blockProps }>
				{ /* If the featured image is linked, wrap in an <a /> tag to trigger any inherited link element styles */ }
				{ !! isLink ? (
					<a
						href={ context[ 'feedland/feed-item' ].link }
						target={ linkTarget }
						{ ...disabledClickProps }
					>
						{ image }
					</a>
				) : (
					image
				) }
				<Overlay
					attributes={ attributes }
					setAttributes={ setAttributes }
					clientId={ clientId }
				/>
			</figure>
		</>
	);
}
