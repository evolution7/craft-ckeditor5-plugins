import { Plugin, Command } from 'ckeditor5/src/core.js';
import {
	ButtonView,
	ContextualBalloon,
	BalloonPanelView,
	View,
	LabeledFieldView,
	createLabeledTextarea,
	submitHandler,
	CssTransitionDisablerMixin
} from 'ckeditor5/src/ui.js';
import { Widget, toWidget } from 'ckeditor5/src/widget.js';
import { FocusTracker, KeystrokeHandler } from 'ckeditor5/src/utils.js';

import '../theme/tooltip.css';

export default class Tooltip extends Plugin {
	private _formView?: TooltipFormView;
	private _balloon?: ContextualBalloon;
	private _clickOutsideHandler?: ( event: Event ) => void;

	public static get requires() {
		return [ Widget, ContextualBalloon ] as const;
	}

	public static get pluginName() {
		return 'Tooltip' as const;
	}

	public init(): void {
		this._balloon = this.editor.plugins.get( ContextualBalloon );
		this._defineSchema();
		this._defineConverters();
		this._defineCommands();
		this._defineUI();
	}

	private _defineSchema(): void {
		const schema = this.editor.model.schema;

		schema.register( 'tooltip', {
			inheritAllFrom: '$inlineObject',
			allowAttributes: [ 'tooltipContent' ]
		} );
	}

	private _defineConverters(): void {
		const editor = this.editor;
		const conversion = editor.conversion;

		// Model to view conversion
		conversion.for( 'editingDowncast' ).elementToElement( {
			model: 'tooltip',
			view: ( modelElement, { writer: viewWriter } ) => {
				const tooltipContent = modelElement.getAttribute( 'tooltipContent' ) || '';

				const tooltipView = viewWriter.createContainerElement( 'span', {
					class: 'e7-tooltip ck-tooltip-widget',
					'title': tooltipContent
				} );

				// Add info icon
				const iconView = viewWriter.createUIElement( 'i', {
					class: 'ck-tooltip-icon'
				}, function( domDocument ) {
					const domElement = this.toDomElement( domDocument );
					domElement.innerHTML = '&#8505;'; // Info icon
					return domElement;
				} );

				viewWriter.insert( viewWriter.createPositionAt( tooltipView, 0 ), iconView );

				return toWidget( tooltipView, viewWriter, { label: 'tooltip widget' } );
			}
		} );

		// Handle tooltipContent attribute changes for editing view
		conversion.for( 'editingDowncast' ).attributeToAttribute( {
			model: 'tooltipContent',
			view: 'title',
			converterPriority: 'low'
		} );

		// Data conversion (for HTML output)
		conversion.for( 'dataDowncast' ).elementToElement( {
			model: 'tooltip',
			view: ( modelElement, { writer: viewWriter } ) => {
				const tooltipContent = modelElement.getAttribute( 'tooltipContent' ) || '';

				const tooltipView = viewWriter.createContainerElement( 'span', {
					class: 'e7-tooltip',
					'title': tooltipContent,
					'x-data': 'tooltip'
				} );

				// Add info icon for the final HTML output too
				const iconView = viewWriter.createUIElement( 'i', {
					class: 'e7-tooltip-icon'
				}, function( domDocument ) {
					const domElement = this.toDomElement( domDocument );
					domElement.innerHTML = '&#8505;'; // Info icon
					return domElement;
				} );

				viewWriter.insert( viewWriter.createPositionAt( tooltipView, 0 ), iconView );

				return tooltipView;
			}
		} );

		// Handle tooltipContent attribute changes for data output
		conversion.for( 'dataDowncast' ).attributeToAttribute( {
			model: 'tooltipContent',
			view: 'title',
			converterPriority: 'low'
		} );

		// View to model conversion
		conversion.for( 'upcast' ).elementToElement( {
			view: {
				name: 'span',
				classes: 'e7-tooltip'
			},
			model: ( viewElement, { writer: modelWriter } ) => {
				const tooltipContent = viewElement.getAttribute( 'title' ) || '';

				return modelWriter.createElement( 'tooltip', {
					tooltipContent
				} );
			},
			converterPriority: 'high'
		} );
	}

	private _defineCommands(): void {
		this.editor.commands.add( 'insertTooltip', new InsertTooltipCommand( this.editor ) );
		this.editor.commands.add( 'editTooltip', new EditTooltipCommand( this.editor ) );
	}

	private _defineUI(): void {
		const editor = this.editor;
		const t = editor.t;

		editor.ui.componentFactory.add( 'tooltip', locale => {
			const button = new ButtonView( locale );

			const iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">' +
				'<circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" stroke-width="2"/>' +
				'<text x="10" y="14" text-anchor="middle" font-size="12" font-weight="bold" fill="currentColor">i</text>' +
				'</svg>';

			button.set( {
				label: t( 'Insert tooltip' ),
				icon: iconSvg,
				tooltip: true
			} );

			button.on( 'execute', () => {
				this._showTooltipBalloon();
			} );

			return button;
		} );

		// Handle clicking on existing tooltips
		// Use document click handler for better reliability
		document.addEventListener( 'click', event => {
			const target = event.target as HTMLElement;
			const tooltipWidget = target.closest( '.ck-tooltip-widget' );

			if ( tooltipWidget && editor.editing.view.document.isFocused ) {
				event.preventDefault();
				event.stopPropagation();

				// Get the view element from the widget
				const viewElement = editor.editing.view.domConverter.mapDomToView( tooltipWidget as HTMLElement );
				if ( viewElement ) {
					// Get the model element
					const modelElement = editor.editing.mapper.toModelElement( viewElement as any );
					if ( modelElement ) {
						// Select the tooltip element first
						editor.model.change( writer => {
							writer.setSelection( modelElement, 'on' );
						} );

						const tooltipContent = modelElement.getAttribute( 'tooltipContent' ) as string || '';
						this._showTooltipBalloon( tooltipContent, true );
					}
				}
			}
		} );
	}

	public _showTooltipBalloon( existingContent = '', isEdit = false ): void {
		const editor = this.editor;

		// Always create a fresh form to avoid content persistence
		this._formView = new ( CssTransitionDisablerMixin( TooltipFormView ) )(
			editor.locale,
			this._getFormValidators()
		);

		// Handle form submission
		const formView = this._formView;
		formView.on( 'submit', () => {
			if ( formView.isValid() ) {
				const content = formView.content;

				if ( isEdit ) {
					editor.execute( 'editTooltip', {
						content
					} );
				} else {
					editor.execute( 'insertTooltip', {
						content
					} );
				}
				this._hideBalloon();
			}
		} );

		// Handle form cancellation
		formView.on( 'cancel', () => {
			this._hideBalloon();
		} );

		// Set form content
		formView.content = existingContent;
		formView.resetFormStatus();

		// Show the balloon
		this._balloon!.add( {
			view: formView,
			position: this._getBalloonPositionData()
		} );

		// Add click outside handler
		this._addClickOutsideHandler();

		// Focus the form
		formView.focus();
	}

	private _hideBalloon(): void {
		if ( this._balloon!.hasView( this._formView! ) ) {
			this._balloon!.remove( this._formView! );
		}

		// Remove click outside handler
		this._removeClickOutsideHandler();

		// Clean up the form
		if ( this._formView ) {
			this._formView.destroy();
			this._formView = undefined;
		}

		// Focus back to editor
		this.editor.editing.view.focus();
	}

	private _getBalloonPositionData() {
		const view = this.editor.editing.view;
		const selection = view.document.selection;
		const range = selection.getFirstRange();

		if ( range ) {
			return {
				target: view.domConverter.viewRangeToDom( range ),
				positions: [
					BalloonPanelView.defaultPositions.northArrowSouth,
					BalloonPanelView.defaultPositions.northArrowSouthWest,
					BalloonPanelView.defaultPositions.northArrowSouthEast,
					BalloonPanelView.defaultPositions.southArrowNorth,
					BalloonPanelView.defaultPositions.southArrowNorthWest,
					BalloonPanelView.defaultPositions.southArrowNorthEast
				]
			};
		}

		return {
			target: this.editor.ui.getEditableElement()!,
			positions: [
				BalloonPanelView.defaultPositions.northArrowSouth
			]
		};
	}

	private _addClickOutsideHandler(): void {
		this._clickOutsideHandler = ( event: Event ) => {
			const target = event.target as HTMLElement;
			const balloonElement = this._balloon?.view?.element;

			if ( balloonElement && !balloonElement.contains( target ) ) {
				this._hideBalloon();
			}
		};

		document.addEventListener( 'click', this._clickOutsideHandler, true );
	}

	private _removeClickOutsideHandler(): void {
		if ( this._clickOutsideHandler ) {
			document.removeEventListener( 'click', this._clickOutsideHandler, true );
			this._clickOutsideHandler = undefined;
		}
	}

	private _getFormValidators() {
		const t = this.editor.t;

		return [
			( form: TooltipFormView ) => {
				if ( !form.content.length ) {
					return t( 'Tooltip content cannot be empty.' );
				}
			}
		];
	}
}

class InsertTooltipCommand extends Command {
	public override execute( options: { content?: string } = {} ): void {
		const model = this.editor.model;

		model.change( writer => {
			const tooltipElement = writer.createElement( 'tooltip', {
				tooltipContent: options.content || ''
			} );

			model.insertContent( tooltipElement );

			writer.setSelection( tooltipElement, 'after' );
		} );
	}

	public override refresh(): void {
		const model = this.editor.model;
		const selection = model.document.selection;
		const allowedIn = model.schema.findAllowedParent( selection.getFirstPosition()!, 'tooltip' );

		this.isEnabled = allowedIn !== null;
	}
}

class EditTooltipCommand extends Command {
	public override execute( options: { content?: string } = {} ): void {
		const model = this.editor.model;
		const selection = model.document.selection;

		// Find the selected tooltip element - check both selected element and parent
		let tooltipElement: any = null;

		// First check if we have a direct selection on the tooltip
		const selectedElement = selection.getSelectedElement();
		if ( selectedElement && selectedElement.name === 'tooltip' ) {
			tooltipElement = selectedElement;
		} else {
			// Fallback to checking parent
			const parent = selection.getFirstPosition()?.parent;
			if ( parent && parent.name === 'tooltip' ) {
				tooltipElement = parent;
			}
		}

		if ( tooltipElement ) {
			model.change( writer => {
				writer.setAttribute( 'tooltipContent', options.content || '', tooltipElement );
			} );
		}
	}

	public override refresh(): void {
		const model = this.editor.model;
		const selection = model.document.selection;

		// Check both selected element and parent
		const selectedElement = selection.getSelectedElement();
		const parentElement = selection.getFirstPosition()?.parent;

		this.isEnabled = ( selectedElement?.name === 'tooltip' ) || ( parentElement?.name === 'tooltip' );
	}
}

class TooltipFormView extends View {
	public focusTracker: FocusTracker;
	public keystrokes: KeystrokeHandler;
	public contentInputView: LabeledFieldView;
	public saveButtonView: ButtonView;
	public cancelButtonView: ButtonView;
	public children: any;
	private _validators: Array<( form: TooltipFormView ) => string | undefined>;

	constructor( locale: any, validators: Array<( form: TooltipFormView ) => string | undefined> = [] ) {
		super( locale );

		// Initialize focus management
		this.focusTracker = new FocusTracker();
		this.keystrokes = new KeystrokeHandler();
		this._validators = validators;

		// Create form elements
		this.contentInputView = this._createContentInput();
		this.saveButtonView = this._createSaveButton();
		this.cancelButtonView = this._createCancelButton();

		// Create children collection
		this.children = this.createCollection( [
			this._createFormRow( [ this.contentInputView ], [ 'ck-form__row_large-top-padding' ] ),
			this._createInstructionsView(),
			this._createActionsRow( [ this.cancelButtonView, this.saveButtonView ] )
		] );

		// Set form template
		this.setTemplate( {
			tag: 'form',
			attributes: {
				class: [ 'ck', 'ck-form', 'ck-tooltip-form', 'ck-responsive-form' ],
				tabindex: '-1'
			},
			children: this.children
		} );

		// Handle Escape key
		this.keystrokes.set( 'Esc', ( _data, cancel ) => {
			this.fire( 'cancel' );
			cancel();
		} );
	}

	public override render(): void {
		super.render();

		// Enable form submission handling
		submitHandler( { view: this } );

		// Register focusable elements
		[ this.contentInputView, this.saveButtonView, this.cancelButtonView ].forEach( view => {
			this.focusTracker.add( view.element! );
		} );

		// Start listening for keystrokes
		this.keystrokes.listenTo( this.element! );
	}

	public override destroy(): void {
		super.destroy();
		this.focusTracker.destroy();
		this.keystrokes.destroy();
	}

	public focus(): void {
		this.contentInputView.focus();
	}

	public isValid(): boolean {
		this.resetFormStatus();

		for ( const validator of this._validators ) {
			const errorText = validator( this );
			if ( errorText ) {
				this.contentInputView.errorText = errorText;
				return false;
			}
		}
		return true;
	}

	public resetFormStatus(): void {
		this.contentInputView.errorText = null;
	}

	private _createContentInput(): LabeledFieldView {
		const t = this.locale?.t || ( ( key: string ) => key );
		const labeledTextarea = new LabeledFieldView( this.locale, createLabeledTextarea );

		labeledTextarea.label = t( 'Tooltip Content' );
		labeledTextarea.class = 'ck-labeled-field-view_full-width';

		// Set textarea-specific attributes
		( labeledTextarea.fieldView as any ).set( {
			minRows: 3,
			maxRows: 8,
			placeholder: t( 'Enter tooltip content here...' )
		} );

		// Add custom styling to make textarea full width
		labeledTextarea.extendTemplate( {
			attributes: {
				style: 'width: 100%;'
			}
		} );

		return labeledTextarea;
	}

	private _createSaveButton(): ButtonView {
		const t = this.locale?.t || ( ( key: string ) => key );
		const button = new ButtonView( this.locale );

		button.set( {
			label: t( 'Save' ),
			withText: true,
			type: 'submit',
			class: 'ck-button-action ck-button-bold'
		} );

		button.on( 'execute', () => {
			this.fire( 'submit' );
		} );

		return button;
	}

	private _createCancelButton(): ButtonView {
		const t = this.locale?.t || ( ( key: string ) => key );
		const button = new ButtonView( this.locale );

		button.set( {
			label: t( 'Cancel' ),
			withText: true
		} );

		button.delegate( 'execute' ).to( this, 'cancel' );
		return button;
	}

	private _createFormRow( children: Array<any>, classNames: Array<string> ): View {
		const rowView = new View( this.locale );

		rowView.setTemplate( {
			tag: 'div',
			attributes: {
				class: [ 'ck', 'ck-form__row', ...classNames ]
			},
			children
		} );

		return rowView;
	}

	private _createActionsRow( children: Array<any> ): View {
		const actionsView = new View( this.locale );

		actionsView.setTemplate( {
			tag: 'div',
			attributes: {
				class: [ 'ck', 'ck-dialog__actions' ]
			},
			children
		} );

		return actionsView;
	}

	private _createInstructionsView(): View {
		const instructionsView = new View( this.locale );

		instructionsView.setTemplate( {
			tag: 'div',
			attributes: {
				class: [ 'ck', 'ck-tooltip-instructions' ],
				style: 'display: none;' // Hide the instructions completely
			},
			children: []
		} );

		return instructionsView;
	}

	// Getter/setter for form values
	public get content(): string {
		return ( this.contentInputView.fieldView.element as HTMLTextAreaElement )?.value?.trim() || '';
	}

	public set content( value: string ) {
		( this.contentInputView.fieldView as any ).value = value;
	}
}
