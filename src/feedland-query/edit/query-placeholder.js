/**
 * WordPress dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import {
	createBlocksFromInnerBlocksTemplate,
	store as blocksStore,
} from '@wordpress/blocks';
import {
	useBlockProps,
	store as blockEditorStore,
	__experimentalBlockVariationPicker,
	__experimentalGetMatchingVariation as getMatchingVariation,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useScopedBlockVariations, useBlockNameForPatterns } from '../utils';

export default function QueryPlaceholder( {
	attributes,
	clientId,
	name,
	setAttributes,
} ) {
	const blockNameForPatterns = useBlockNameForPatterns(
		clientId,
		attributes
	);

	const { blockType, allVariations } = useSelect(
		( select ) => {
			const { getBlockVariations, getBlockType } = select( blocksStore );

			return {
				blockType: getBlockType( name ),
				allVariations: getBlockVariations( name ),
			};
		},
		[ name, blockNameForPatterns, clientId ]
	);

	const matchingVariation = getMatchingVariation( attributes, allVariations );
	const icon =
		matchingVariation?.icon?.src ||
		matchingVariation?.icon ||
		blockType?.icon?.src;
	const label = matchingVariation?.title || blockType?.title;

	return (
		<QueryVariationPicker
			clientId={ clientId }
			attributes={ attributes }
			setAttributes={ setAttributes }
			icon={ icon }
			label={ label }
		/>
	);
}

function QueryVariationPicker( {
	clientId,
	attributes,
	setAttributes,
	icon,
	label,
} ) {
	const scopeVariations = useScopedBlockVariations( attributes );
	const { replaceInnerBlocks } = useDispatch( blockEditorStore );
	const blockProps = useBlockProps();
	return (
		<div { ...blockProps }>
			<__experimentalBlockVariationPicker
				icon={ icon }
				label={ label }
				variations={ scopeVariations }
				onSelect={ ( variation ) => {
					if ( variation.attributes ) {
						setAttributes( {
							...variation.attributes,
							query: {
								...variation.attributes.query,
							},
							namespace: attributes.namespace,
						} );
					}
					if ( variation.innerBlocks ) {
						replaceInnerBlocks(
							clientId,
							createBlocksFromInnerBlocksTemplate(
								variation.innerBlocks
							),
							false
						);
					}
				} }
			/>
		</div>
	);
}
