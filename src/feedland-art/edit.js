/**
 * WordPress dependencies
 */
import {
	BlockControls,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	Button,
	Disabled,
	PanelBody,
	Placeholder,
	RangeControl,
	ToolbarGroup,
	__experimentalHStack as HStack,
	__experimentalInputControl as InputControl,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { edit, rss } from '@wordpress/icons';
import ServerSideRender from '@wordpress/server-side-render';

const DEFAULT_MIN_ITEMS = 1;
const DEFAULT_MAX_ITEMS = 20;

export default function Edit( { attributes, setAttributes } ) {
	const [ isEditing, setIsEditing ] = useState( ! attributes.readingListUrl );

	const { readingListUrl, itemsToShow } = attributes;

	function toggleAttribute( propName ) {
		return () => {
			const value = attributes[ propName ];

			setAttributes( { [ propName ]: ! value } );
		};
	}

	function onSubmitURL( event ) {
		event.preventDefault();

		if ( readingListUrl ) {
			setAttributes( { readingListUrl: readingListUrl } );
			setIsEditing( false );
		}
	}

	const blockProps = useBlockProps();

	if ( isEditing ) {
		return (
			<div { ...blockProps }>
				<Placeholder icon={ rss } label="FeedLand">
					<form
						onSubmit={ onSubmitURL }
						className="wp-block-feedland-art__placeholder-form"
					>
						<HStack wrap>
							<InputControl
								__next40pxDefaultSize
								placeholder={ __(
									'Enter reading list URL here…',
									'feedland'
								) }
								value={ readingListUrl }
								onChange={ ( value ) =>
									setAttributes( { readingListUrl: value } )
								}
								className="wp-block-feedland-art__placeholder-input"
							/>
							<Button
								__next40pxDefaultSize
								variant="primary"
								type="submit"
							>
								{ __( 'Done', 'feedland' ) }
							</Button>
						</HStack>
					</form>
				</Placeholder>
			</div>
		);
	}

	const toolbarControls = [
		{
			icon: edit,
			title: __( 'Edit reading list URL', 'feedland' ),
			onClick: () => setIsEditing( true ),
		},
	];

	return (
		<>
			<BlockControls>
				<ToolbarGroup controls={ toolbarControls } />
			</BlockControls>
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'feedland' ) }>
					<RangeControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={ __( 'Number of items', 'feedland' ) }
						value={ itemsToShow }
						onChange={ ( value ) =>
							setAttributes( { itemsToShow: value } )
						}
						min={ DEFAULT_MIN_ITEMS }
						max={ DEFAULT_MAX_ITEMS }
						required
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<Disabled>
					<ServerSideRender
						block="feedland/art"
						attributes={ attributes }
					/>
				</Disabled>
			</div>
		</>
	);
}
