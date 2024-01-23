/**
 * External dependencies
 */
import classnames from 'classnames';

import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	BlockContextProvider,
	useInnerBlocksProps,
	BlockControls,
	__experimentalUseBlockPreview as useBlockPreview,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { memo, useState, useEffect, useMemo } from '@wordpress/element';
import { Spinner, ToolbarGroup } from '@wordpress/components';
import { list, grid } from '@wordpress/icons';

const TEMPLATE = [
	[ 'feedland/feed-item-title' ],
	[ 'feedland/feed-item-date' ],
];

function FeedTemplateInnerBlocks() {
	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'wp-block-post' },
		{ template: TEMPLATE, __unstableDisableLayoutClassNames: true }
	);
	return <li { ...innerBlocksProps } />;
}

function FeedTemplateBlockPreview( {
	blocks,
	blockContextId,
	isHidden,
	setActiveBlockContextId,
} ) {
	const blockPreviewProps = useBlockPreview( {
		blocks,
		props: {
			className: 'wp-block-post',
		},
	} );

	const handleOnClick = () => {
		setActiveBlockContextId( blockContextId );
	};

	const style = {
		display: isHidden ? 'none' : undefined,
	};

	return (
		<li
			{ ...blockPreviewProps }
			tabIndex={ 0 }
			// eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
			role="button"
			onClick={ handleOnClick }
			onKeyPress={ handleOnClick }
			style={ style }
		/>
	);
}

const MemoizedFeedTemplateBlockPreview = memo( FeedTemplateBlockPreview );

export default function Edit( {
	setAttributes,
	clientId,
	context: { [ 'feedland/query' ]: { perPage, category, screenName } } = {},
	attributes: { layout },
	__unstableLayoutClassNames,
} ) {
	const { type: layoutType, columnCount = 3 } = layout || {};
	const [ activeBlockContextId, setActiveBlockContextId ] = useState();
	const [ feedItems, setFeedItems ] = useState( [] );
	const [ loading, setLoading ] = useState( true );

	const blocks = useSelect( ( select ) => {
		const { getBlocks } = select( blockEditorStore );
		return getBlocks( clientId );
	}, [] );

	useEffect( () => {
		setLoading( true );
		fetch(
			`https://feedland.com/getriverfromcategory?screenname=${ screenName }&catname=${ category }`
		)
			.then( ( response ) => response.json() )
			.then( ( data ) => {
				setFeedItems(
					data.feeds
						.flatMap( ( feed ) => feed.items )
						.splice( 0, perPage )
				);
			} )
			.catch( () => {
				setFeedItems( [] );
			} )
			.finally( () => setLoading( false ) );
	}, [ screenName, category, perPage ] );

	const blockContexts = useMemo(
		() =>
			feedItems?.map( ( item ) => ( {
				[ 'feedland/feed-item' ]: item,
			} ) ),
		[ feedItems ]
	);

	const blockProps = useBlockProps( {
		className: classnames( __unstableLayoutClassNames, {
			[ `columns-${ columnCount }` ]:
				layoutType === 'grid' && columnCount, // Ensure column count is flagged via classname for backwards compatibility.
		} ),
	} );

	if ( loading ) {
		return (
			<p { ...blockProps }>
				<Spinner />
			</p>
		);
	}

	if ( ! feedItems.length ) {
		return (
			<p { ...blockProps }> { __( 'No results found.', 'feedland' ) }</p>
		);
	}

	const setDisplayLayout = ( newDisplayLayout ) =>
		setAttributes( {
			layout: { ...layout, ...newDisplayLayout },
		} );

	const displayLayoutControls = [
		{
			icon: list,
			title: __( 'List view', 'feedland' ),
			onClick: () => setDisplayLayout( { type: 'default' } ),
			isActive: layoutType === 'default' || layoutType === 'constrained',
		},
		{
			icon: grid,
			title: __( 'Grid view', 'feedland' ),
			onClick: () =>
				setDisplayLayout( {
					type: 'grid',
					columnCount,
				} ),
			isActive: layoutType === 'grid',
		},
	];

	return (
		<>
			<BlockControls>
				<ToolbarGroup controls={ displayLayoutControls } />
			</BlockControls>
			<ul { ...blockProps }>
				{ blockContexts &&
					blockContexts.map( ( blockContext, index ) => (
						<BlockContextProvider
							key={ index }
							value={ blockContext }
						>
							{ index ===
							( activeBlockContextId ||
								blockContexts[ 0 ]?.[
									'feedland/feed-item'
								] ) ? (
								<FeedTemplateInnerBlocks />
							) : null }
							<MemoizedFeedTemplateBlockPreview
								blocks={ blocks }
								blockContextId={ index }
								setActiveBlockContextId={
									setActiveBlockContextId
								}
								isHidden={
									index ===
									( activeBlockContextId ||
										blockContexts[ 0 ]?.[
											'feedland/feed-item'
										] )
								}
							/>
						</BlockContextProvider>
					) ) }
			</ul>
		</>
	);
}
