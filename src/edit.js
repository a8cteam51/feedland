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
	ToggleControl,
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
	const [ isEditing, setIsEditing ] = useState(
		! ( attributes.screenname && attributes.category )
	);

	const {
		displayDate,
		displayExcerpt,
		excerptLength,
		screenname,
		category,
		itemsToShow,
	} = attributes;

	function toggleAttribute( propName ) {
		return () => {
			const value = attributes[ propName ];

			setAttributes( { [ propName ]: ! value } );
		};
	}

	function onSubmitURL( event ) {
		event.preventDefault();

		if ( screenname && category ) {
			setAttributes( { screenname: screenname, category: category } );
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
						className="wp-block-feedland-feedviewer__placeholder-form"
					>
						<HStack wrap>
							<InputControl
								__next40pxDefaultSize
								placeholder={ __(
									'Enter screenname here…',
									'feedland'
								) }
								value={ screenname }
								onChange={ ( value ) =>
									setAttributes( { screenname: value } )
								}
								className="wp-block-feedland-feedviewer__placeholder-input"
							/>
							<InputControl
								__next40pxDefaultSize
								placeholder={ __(
									'Enter category here…',
									'feedland'
								) }
								value={ category }
								onChange={ ( value ) =>
									setAttributes( { category: value } )
								}
								className="wp-block-feedland-feedviewer__placeholder-input"
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
			title: __( 'Edit category and screenname', 'feedland' ),
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
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Display date', 'feedland' ) }
						checked={ displayDate }
						onChange={ toggleAttribute( 'displayDate' ) }
					/>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Display excerpt', 'feedland' ) }
						checked={ displayExcerpt }
						onChange={ toggleAttribute( 'displayExcerpt' ) }
					/>
					{ displayExcerpt && (
						<RangeControl
							__nextHasNoMarginBottom
							__next40pxDefaultSize
							label={ __(
								'Max number of words in excerpt',
								'feedland'
							) }
							value={ excerptLength }
							onChange={ ( value ) =>
								setAttributes( { excerptLength: value } )
							}
							min={ 10 }
							max={ 100 }
							required
						/>
					) }
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<Disabled>
					<ServerSideRender
						block="feedland/feedviewer"
						attributes={ attributes }
					/>
				</Disabled>
			</div>
		</>
	);
}
