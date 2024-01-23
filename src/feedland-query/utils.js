/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { store as blocksStore } from '@wordpress/blocks';

/** @typedef {import('@wordpress/blocks').WPBlockVariation} WPBlockVariation */

/**
 * @typedef IHasNameAndId
 * @property {string|number} id   The entity's id.
 * @property {string}        name The entity's name.
 */

/**
 * The object used in Query block that contains info and helper mappings
 * from an array of IHasNameAndId objects.
 *
 * @typedef {Object} QueryEntitiesInfo
 * @property {IHasNameAndId[]}               entities  The array of entities.
 * @property {Object<string, IHasNameAndId>} mapById   Object mapping with the id as key and the entity as value.
 * @property {Object<string, IHasNameAndId>} mapByName Object mapping with the name as key and the entity as value.
 * @property {string[]}                      names     Array with the entities' names.
 */

/**
 * Returns a helper object that contains:
 * 1. An `options` object from the available post types, to be passed to a `SelectControl`.
 * 2. A helper map with available taxonomies per post type.
 *
 * @return {Object} The helper object related to post types.
 */
export const usePostTypes = () => {
	const postTypes = useSelect( ( select ) => {
		const { getPostTypes } = select( coreStore );
		const excludedPostTypes = [ 'attachment' ];
		const filteredPostTypes = getPostTypes( { per_page: -1 } )?.filter(
			( { viewable, slug } ) =>
				viewable && ! excludedPostTypes.includes( slug )
		);
		return filteredPostTypes;
	}, [] );
	const postTypesTaxonomiesMap = useMemo( () => {
		if ( ! postTypes?.length ) return;
		return postTypes.reduce( ( accumulator, type ) => {
			accumulator[ type.slug ] = type.taxonomies;
			return accumulator;
		}, {} );
	}, [ postTypes ] );
	const postTypesSelectOptions = useMemo(
		() =>
			( postTypes || [] ).map( ( { labels, slug } ) => ( {
				label: labels.singular_name,
				value: slug,
			} ) ),
		[ postTypes ]
	);
	return { postTypesTaxonomiesMap, postTypesSelectOptions };
};

/**
 * Hook that returns the taxonomies associated with a specific post type.
 *
 * @param {string} postType The post type from which to retrieve the associated taxonomies.
 * @return {Object[]} An array of the associated taxonomies.
 */
export const useTaxonomies = ( postType ) => {
	const taxonomies = useSelect(
		( select ) => {
			const { getTaxonomies } = select( coreStore );
			const filteredTaxonomies = getTaxonomies( {
				type: postType,
				per_page: -1,
				context: 'view',
			} );
			return filteredTaxonomies;
		},
		[ postType ]
	);
	return taxonomies;
};

/**
 * Hook that returns whether a specific post type is hierarchical.
 *
 * @param {string} postType The post type to check.
 * @return {boolean} Whether a specific post type is hierarchical.
 */
export function useIsPostTypeHierarchical( postType ) {
	return useSelect(
		( select ) => {
			const type = select( coreStore ).getPostType( postType );
			return type?.viewable && type?.hierarchical;
		},
		[ postType ]
	);
}

/**
 * Hook that returns the query properties' names defined by the active
 * block variation, to determine which block's filters to show.
 *
 * @param {Object} attributes Block attributes.
 * @return {string[]} An array of the query attributes.
 */
export function useAllowedControls( attributes ) {
	return useSelect(
		( select ) =>
			select( blocksStore ).getActiveBlockVariation(
				'feedland/query',
				attributes
			)?.allowedControls,

		[ attributes ]
	);
}
export function isControlAllowed( allowedControls, key ) {
	// Every controls is allowed if the list is not defined.
	if ( ! allowedControls ) {
		return true;
	}
	return allowedControls.includes( key );
}

/**
 * Helper hook that determines if there is an active variation of the block
 * and if there are available specific patterns for this variation.
 * If there are, these patterns are going to be the only ones suggested to
 * the user in setup and replace flow, without including the default ones
 * for Query Loop.
 *
 * If there are no such patterns, the default ones for Query Loop are going
 * to be suggested.
 *
 * @param {string} clientId   The block's client ID.
 * @param {Object} attributes The block's attributes.
 * @return {string} The block name to be used in the patterns suggestions.
 */
export function useBlockNameForPatterns( clientId, attributes ) {
	const activeVariationName = useSelect(
		( select ) =>
			select( blocksStore ).getActiveBlockVariation(
				'feedland/query',
				attributes
			)?.name,
		[ attributes ]
	);
	const blockName = `feedland/query/${ activeVariationName }`;
	const hasActiveVariationPatterns = useSelect(
		( select ) => {
			if ( ! activeVariationName ) {
				return false;
			}
			const { getBlockRootClientId, getPatternsByBlockTypes } =
				select( blockEditorStore );
			const rootClientId = getBlockRootClientId( clientId );
			const activePatterns = getPatternsByBlockTypes(
				blockName,
				rootClientId
			);
			return activePatterns.length > 0;
		},
		[ clientId, activeVariationName, blockName ]
	);
	return hasActiveVariationPatterns ? blockName : 'feedland/query';
}

/**
 * Helper hook that determines if there is an active variation of the block
 * and if there are available specific scoped `block` variations connected with
 * this variation.
 *
 * If there are, these variations are going to be the only ones suggested
 * to the user in setup flow when clicking to `start blank`, without including
 * the default ones for Query Loop.
 *
 * If there are no such scoped `block` variations, the default ones for Query
 * Loop are going to be suggested.
 *
 * The way we determine such variations is with the convention that they have the `namespace`
 * attribute defined as an array. This array should contain the names(`name` property) of any
 * variations they want to be connected to.
 * For example, if we have a `Query Loop` scoped `inserter` variation with the name `products`,
 * we can connect a scoped `block` variation by setting its `namespace` attribute to `['products']`.
 * If the user selects this variation, the `namespace` attribute will be overridden by the
 * main `inserter` variation.
 *
 * @param {Object} attributes The block's attributes.
 * @return {WPBlockVariation[]} The block variations to be suggested in setup flow, when clicking to `start blank`.
 */
export function useScopedBlockVariations( attributes ) {
	const { activeVariationName, blockVariations } = useSelect(
		( select ) => {
			const { getActiveBlockVariation, getBlockVariations } =
				select( blocksStore );
			return {
				activeVariationName: getActiveBlockVariation(
					'feedland/query',
					attributes
				)?.name,
				blockVariations: getBlockVariations(
					'feedland/query',
					'block'
				),
			};
		},
		[ attributes ]
	);
	const variations = useMemo( () => {
		// Filter out the variations that have defined a `namespace` attribute,
		// which means they are 'connected' to specific variations of the block.
		const isNotConnected = ( variation ) =>
			! variation.attributes?.namespace;
		if ( ! activeVariationName ) {
			return blockVariations.filter( isNotConnected );
		}
		const connectedVariations = blockVariations.filter( ( variation ) =>
			variation.attributes?.namespace?.includes( activeVariationName )
		);
		if ( !! connectedVariations.length ) {
			return connectedVariations;
		}
		return blockVariations.filter( isNotConnected );
	}, [ activeVariationName, blockVariations ] );
	return variations;
}
