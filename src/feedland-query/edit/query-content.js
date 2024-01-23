/**
 * WordPress dependencies
 */
import {
	BlockControls,
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import QueryToolbar from './query-toolbar';
import QueryInspectorControls from './inspector-controls';

const TEMPLATE = [ [ 'feedland/feed-template' ] ];
export default function QueryContent( {
	attributes,
	setAttributes,
	clientId,
} ) {
	const { query, tagName: TagName = 'div' } = attributes;

	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		template: TEMPLATE,
	} );

	const updateQuery = ( newQuery ) =>
		setAttributes( { query: { ...query, ...newQuery } } );

	const htmlElementMessages = {
		main: __(
			'The <main> element should be used for the primary content of your document only.',
			'feedland'
		),
		section: __(
			"The <section> element should represent a standalone portion of the document that can't be better represented by another element.",
			'feedland'
		),
		aside: __(
			"The <aside> element should represent a portion of a document whose content is only indirectly related to the document's main content.",
			'feedland'
		),
	};

	return (
		<>
			<InspectorControls>
				<QueryInspectorControls
					attributes={ attributes }
					setQuery={ updateQuery }
					setAttributes={ setAttributes }
					clientId={ clientId }
				/>
			</InspectorControls>
			<BlockControls>
				<QueryToolbar
					attributes={ attributes }
					setQuery={ updateQuery }
				/>
			</BlockControls>
			<InspectorControls group="advanced">
				<SelectControl
					__nextHasNoMarginBottom
					__next40pxDefaultSize
					label={ __( 'HTML element' ) }
					options={ [
						{ label: __( 'Default (<div>)' ), value: 'div' },
						{ label: '<main>', value: 'main' },
						{ label: '<section>', value: 'section' },
						{ label: '<aside>', value: 'aside' },
					] }
					value={ TagName }
					onChange={ ( value ) =>
						setAttributes( { tagName: value } )
					}
					help={ htmlElementMessages[ TagName ] }
				/>
			</InspectorControls>
			<TagName { ...innerBlocksProps } />
		</>
	);
}
