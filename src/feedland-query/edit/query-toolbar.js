/**
 * WordPress dependencies
 */
import {
	ToolbarGroup,
	Dropdown,
	ToolbarButton,
	BaseControl,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { settings } from '@wordpress/icons';

export default function QueryToolbar( { attributes: { query }, setQuery } ) {
	return (
		<>
			<ToolbarGroup>
				<Dropdown
					contentClassName="block-library-query-toolbar__popover"
					renderToggle={ ( { onToggle } ) => (
						<ToolbarButton
							icon={ settings }
							label={ __( 'Display settings', 'feedland' ) }
							onClick={ onToggle }
						/>
					) }
					renderContent={ () => (
						<>
							<BaseControl>
								<NumberControl
									__unstableInputWidth="60px"
									label={ __( 'Items to show', 'feedland' ) }
									labelPosition="edge"
									min={ 1 }
									max={ 100 }
									onChange={ ( value ) => {
										if (
											isNaN( value ) ||
											value < 1 ||
											value > 100
										) {
											return;
										}
										setQuery( {
											perPage: value,
										} );
									} }
									step="1"
									value={ query.perPage }
									isDragEnabled={ false }
									help={ __(
										'Set how many items from your feed you want to show on the page.',
										'feedland'
									) }
								/>
							</BaseControl>
						</>
					) }
				/>
			</ToolbarGroup>
		</>
	);
}
