/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';
import {
	SelectControl,
	__experimentalUnitControl as UnitControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	__experimentalUseCustomUnits as useCustomUnits,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';

const SCALE_OPTIONS = (
	<>
		<ToggleGroupControlOption
			value="cover"
			label={ _x( 'Cover', 'Scale option for Image dimension control' ) }
		/>
		<ToggleGroupControlOption
			value="contain"
			label={ _x(
				'Contain',
				'Scale option for Image dimension control'
			) }
		/>
		<ToggleGroupControlOption
			value="fill"
			label={ _x( 'Fill', 'Scale option for Image dimension control' ) }
		/>
	</>
);

const DEFAULT_SCALE = 'cover';

const scaleHelp = {
	cover: __(
		'Image is scaled and cropped to fill the entire space without being distorted.'
	),
	contain: __(
		'Image is scaled to fill the space without clipping nor distorting.'
	),
	fill: __(
		'Image will be stretched and distorted to completely fill the space.'
	),
};

const DimensionControls = ( {
	clientId,
	attributes: { aspectRatio, width, height, scale },
	setAttributes,
} ) => {
	const units = useCustomUnits( {
		availableUnits: [ 'px', '%', 'vw', 'em', 'rem' ],
	} );
	const onDimensionChange = ( dimension, nextValue ) => {
		const parsedValue = parseFloat( nextValue );
		/**
		 * If we have no value set and we change the unit,
		 * we don't want to set the attribute, as it would
		 * end up having the unit as value without any number.
		 */
		if ( isNaN( parsedValue ) && nextValue ) return;
		setAttributes( {
			[ dimension ]: parsedValue < 0 ? '0' : nextValue,
		} );
	};
	const scaleLabel = _x( 'Scale', 'Image scaling options' );

	const showScaleControl =
		height || ( aspectRatio && aspectRatio !== 'auto' );

	return (
		<InspectorControls group="dimensions">
			<ToolsPanelItem
				hasValue={ () => !! aspectRatio }
				label={ __( 'Aspect ratio', 'feedland' ) }
				onDeselect={ () => setAttributes( { aspectRatio: undefined } ) }
				resetAllFilter={ () => ( {
					aspectRatio: undefined,
				} ) }
				isShownByDefault={ true }
				panelId={ clientId }
			>
				<SelectControl
					__nextHasNoMarginBottom
					label={ __( 'Aspect ratio', 'feedland' ) }
					value={ aspectRatio }
					options={ [
						// These should use the same values as AspectRatioDropdown in @wordpress/block-editor
						{
							label: __( 'Original', 'feedland' ),
							value: 'auto',
						},
						{
							label: __( 'Square', 'feedland' ),
							value: '1',
						},
						{
							label: __( '16:9', 'feedland' ),
							value: '16/9',
						},
						{
							label: __( '4:3', 'feedland' ),
							value: '4/3',
						},
						{
							label: __( '3:2', 'feedland' ),
							value: '3/2',
						},
						{
							label: __( '9:16', 'feedland' ),
							value: '9/16',
						},
						{
							label: __( '3:4', 'feedland' ),
							value: '3/4',
						},
						{
							label: __( '2:3' ),
							value: '2/3',
						},
					] }
					onChange={ ( nextAspectRatio ) =>
						setAttributes( { aspectRatio: nextAspectRatio } )
					}
				/>
			</ToolsPanelItem>
			<ToolsPanelItem
				className="single-column"
				hasValue={ () => !! height }
				label={ __( 'Height', 'feedland' ) }
				onDeselect={ () => setAttributes( { height: undefined } ) }
				resetAllFilter={ () => ( {
					height: undefined,
				} ) }
				isShownByDefault={ true }
				panelId={ clientId }
			>
				<UnitControl
					label={ __( 'Height', 'feedland' ) }
					labelPosition="top"
					value={ height || '' }
					min={ 0 }
					onChange={ ( nextHeight ) =>
						onDimensionChange( 'height', nextHeight )
					}
					units={ units }
				/>
			</ToolsPanelItem>
			<ToolsPanelItem
				className="single-column"
				hasValue={ () => !! width }
				label={ __( 'Width', 'feedland' ) }
				onDeselect={ () => setAttributes( { width: undefined } ) }
				resetAllFilter={ () => ( {
					width: undefined,
				} ) }
				isShownByDefault={ true }
				panelId={ clientId }
			>
				<UnitControl
					label={ __( 'Width', 'feedland' ) }
					labelPosition="top"
					value={ width || '' }
					min={ 0 }
					onChange={ ( nextWidth ) =>
						onDimensionChange( 'width', nextWidth )
					}
					units={ units }
				/>
			</ToolsPanelItem>
			{ showScaleControl && (
				<ToolsPanelItem
					hasValue={ () => !! scale && scale !== DEFAULT_SCALE }
					label={ scaleLabel }
					onDeselect={ () =>
						setAttributes( {
							scale: DEFAULT_SCALE,
						} )
					}
					resetAllFilter={ () => ( {
						scale: DEFAULT_SCALE,
					} ) }
					isShownByDefault={ true }
					panelId={ clientId }
				>
					<ToggleGroupControl
						__nextHasNoMarginBottom
						label={ scaleLabel }
						value={ scale }
						help={ scaleHelp[ scale ] }
						onChange={ ( value ) =>
							setAttributes( {
								scale: value,
							} )
						}
						isBlock
					>
						{ SCALE_OPTIONS }
					</ToggleGroupControl>
				</ToolsPanelItem>
			) }
		</InspectorControls>
	);
};

export default DimensionControls;
