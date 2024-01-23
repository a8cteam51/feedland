/**
 * WordPress dependencies
 */
import { PanelBody, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { debounce } from '@wordpress/compose';
import { useEffect, useState, useCallback } from '@wordpress/element';

export default function QueryInspectorControls( props ) {
	const { attributes, setQuery } = props;
	const { query } = attributes;

	const [ queryScreenName, setQueryScreenName ] = useState(
		query.screenName
	);
	const [ queryCategory, setQueryCategory ] = useState( query.category );
	const onChangeDebounced = useCallback(
		debounce( () => {
			if ( query.screenName !== queryScreenName ) {
				setQuery( { screenName: queryScreenName } );
			}

			if ( query.category !== queryCategory ) {
				setQuery( { category: queryCategory } );
			}
		}, 700 ),
		[ queryScreenName, query.screenName, queryCategory, query.category ]
	);
	useEffect( () => {
		onChangeDebounced();
		return onChangeDebounced.cancel;
	}, [ queryScreenName, queryCategory, onChangeDebounced ] );

	return (
		<>
			<PanelBody title={ __( 'Settings', 'feedland' ) }>
				<TextControl
					__nextHasNoMarginBottom
					label={ __( 'Screenname', 'feedland' ) }
					value={ queryScreenName }
					onChange={ setQueryScreenName }
					help={ __(
						'Enter the screen name of the FeedLand user you want to display posts from.',
						'feedland'
					) }
				/>
				<TextControl
					__nextHasNoMarginBottom
					label={ __( 'Category', 'feedland' ) }
					value={ queryCategory }
					onChange={ setQueryCategory }
					help={ __(
						'Enter the category of the news product.',
						'feedland'
					) }
				/>
			</PanelBody>
		</>
	);
}
