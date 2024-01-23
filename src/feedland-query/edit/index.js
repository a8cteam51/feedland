/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import QueryContent from './query-content';
import QueryPlaceholder from './query-placeholder';

const QueryEdit = ( props ) => {
	const { clientId } = props;
	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( blockEditorStore ).getBlocks( clientId ).length,
		[ clientId ]
	);
	const Component = hasInnerBlocks ? QueryContent : QueryPlaceholder;
	return (
		<>
			<Component { ...props } />
		</>
	);
};

export default QueryEdit;
