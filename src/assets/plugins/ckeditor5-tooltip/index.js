import { Plugin, Widget, ContextualBalloon, toWidget, ButtonView, CssTransitionDisablerMixin, BalloonPanelView, Command, View, FocusTracker, KeystrokeHandler, submitHandler, LabeledFieldView, createLabeledTextarea } from 'ckeditor5';

var ckeditor = "<svg width='68' height='64' viewBox='0 0 68 64' xmlns='http://www.w3.org/2000/svg'><g fill='none' fill-rule='evenodd'><path d='M43.71 11.025a11.508 11.508 0 0 0-1.213 5.159c0 6.42 5.244 11.625 11.713 11.625.083 0 .167 0 .25-.002v16.282a5.464 5.464 0 0 1-2.756 4.739L30.986 60.7a5.548 5.548 0 0 1-5.512 0L4.756 48.828A5.464 5.464 0 0 1 2 44.089V20.344c0-1.955 1.05-3.76 2.756-4.738L25.474 3.733a5.548 5.548 0 0 1 5.512 0l12.724 7.292z' fill='#FFF'/><path d='M45.684 8.79a12.604 12.604 0 0 0-1.329 5.65c0 7.032 5.744 12.733 12.829 12.733.091 0 .183-.001.274-.003v17.834a5.987 5.987 0 0 1-3.019 5.19L31.747 63.196a6.076 6.076 0 0 1-6.037 0L3.02 50.193A5.984 5.984 0 0 1 0 45.003V18.997c0-2.14 1.15-4.119 3.019-5.19L25.71.804a6.076 6.076 0 0 1 6.037 0L45.684 8.79zm-29.44 11.89c-.834 0-1.51.671-1.51 1.498v.715c0 .828.676 1.498 1.51 1.498h25.489c.833 0 1.51-.67 1.51-1.498v-.715c0-.827-.677-1.498-1.51-1.498h-25.49.001zm0 9.227c-.834 0-1.51.671-1.51 1.498v.715c0 .828.676 1.498 1.51 1.498h18.479c.833 0 1.509-.67 1.509-1.498v-.715c0-.827-.676-1.498-1.51-1.498H16.244zm0 9.227c-.834 0-1.51.671-1.51 1.498v.715c0 .828.676 1.498 1.51 1.498h25.489c.833 0 1.51-.67 1.51-1.498v-.715c0-.827-.677-1.498-1.51-1.498h-25.49.001zm41.191-14.459c-5.835 0-10.565-4.695-10.565-10.486 0-5.792 4.73-10.487 10.565-10.487C63.27 3.703 68 8.398 68 14.19c0 5.791-4.73 10.486-10.565 10.486v-.001z' fill='#1EBC61' fill-rule='nonzero'/><path d='M60.857 15.995c0-.467-.084-.875-.251-1.225a2.547 2.547 0 0 0-.686-.88 2.888 2.888 0 0 0-1.026-.531 4.418 4.418 0 0 0-1.259-.175c-.134 0-.283.006-.447.018-.15.01-.3.034-.446.07l.075-1.4h3.587v-1.8h-5.462l-.214 5.06c.319-.116.682-.21 1.089-.28.406-.071.77-.107 1.088-.107.218 0 .437.021.655.063.218.041.413.114.585.218s.313.244.422.419c.109.175.163.391.163.65 0 .424-.132.745-.396.961a1.434 1.434 0 0 1-.938.325c-.352 0-.656-.1-.912-.3-.256-.2-.43-.453-.523-.762l-1.925.588c.1.35.258.664.472.943.214.279.47.514.767.706.298.191.63.339.995.443.365.104.749.156 1.151.156.437 0 .86-.064 1.272-.193.41-.13.778-.323 1.1-.581a2.8 2.8 0 0 0 .775-.981c.193-.396.29-.864.29-1.405h-.001z' fill='#FFF' fill-rule='nonzero'/></g></svg>\n";

class Tooltip extends Plugin {
    _formView;
    _balloon;
    _clickOutsideHandler;
    static get requires() {
        return [
            Widget,
            ContextualBalloon
        ];
    }
    static get pluginName() {
        return 'Tooltip';
    }
    init() {
        this._balloon = this.editor.plugins.get(ContextualBalloon);
        this._defineSchema();
        this._defineConverters();
        this._defineCommands();
        this._defineUI();
    }
    _defineSchema() {
        const schema = this.editor.model.schema;
        schema.register('tooltip', {
            inheritAllFrom: '$inlineObject',
            allowAttributes: [
                'tooltipContent'
            ]
        });
    }
    _defineConverters() {
        const editor = this.editor;
        const conversion = editor.conversion;
        // Model to view conversion
        conversion.for('editingDowncast').elementToElement({
            model: 'tooltip',
            view: (modelElement, { writer: viewWriter })=>{
                const tooltipContent = modelElement.getAttribute('tooltipContent') || '';
                const tooltipView = viewWriter.createContainerElement('span', {
                    class: 'e7-tooltip ck-tooltip-widget',
                    'title': tooltipContent
                });
                // Add info icon
                const iconView = viewWriter.createUIElement('i', {
                    class: 'ck-tooltip-icon'
                }, function(domDocument) {
                    const domElement = this.toDomElement(domDocument);
                    domElement.innerHTML = '&#8505;'; // Info icon
                    return domElement;
                });
                viewWriter.insert(viewWriter.createPositionAt(tooltipView, 0), iconView);
                return toWidget(tooltipView, viewWriter, {
                    label: 'tooltip widget'
                });
            }
        });
        // Handle tooltipContent attribute changes for editing view
        conversion.for('editingDowncast').attributeToAttribute({
            model: 'tooltipContent',
            view: 'title',
            converterPriority: 'low'
        });
        // Data conversion (for HTML output)
        conversion.for('dataDowncast').elementToElement({
            model: 'tooltip',
            view: (modelElement, { writer: viewWriter })=>{
                const tooltipContent = modelElement.getAttribute('tooltipContent') || '';
                const tooltipView = viewWriter.createContainerElement('span', {
                    class: 'e7-tooltip',
                    'title': tooltipContent,
                    'x-data': 'tooltip'
                });
                // Add info icon for the final HTML output too
                const iconView = viewWriter.createUIElement('i', {
                    class: 'e7-tooltip-icon'
                }, function(domDocument) {
                    const domElement = this.toDomElement(domDocument);
                    domElement.innerHTML = '&#8505;'; // Info icon
                    return domElement;
                });
                viewWriter.insert(viewWriter.createPositionAt(tooltipView, 0), iconView);
                return tooltipView;
            }
        });
        // Handle tooltipContent attribute changes for data output
        conversion.for('dataDowncast').attributeToAttribute({
            model: 'tooltipContent',
            view: 'title',
            converterPriority: 'low'
        });
        // View to model conversion
        conversion.for('upcast').elementToElement({
            view: {
                name: 'span',
                classes: 'e7-tooltip'
            },
            model: (viewElement, { writer: modelWriter })=>{
                const tooltipContent = viewElement.getAttribute('title') || '';
                return modelWriter.createElement('tooltip', {
                    tooltipContent
                });
            },
            converterPriority: 'high'
        });
    }
    _defineCommands() {
        this.editor.commands.add('insertTooltip', new InsertTooltipCommand(this.editor));
        this.editor.commands.add('editTooltip', new EditTooltipCommand(this.editor));
    }
    _defineUI() {
        const editor = this.editor;
        const t = editor.t;
        editor.ui.componentFactory.add('tooltip', (locale)=>{
            const button = new ButtonView(locale);
            const iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">' + '<circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" stroke-width="2"/>' + '<text x="10" y="14" text-anchor="middle" font-size="12" font-weight="bold" fill="currentColor">i</text>' + '</svg>';
            button.set({
                label: t('Insert tooltip'),
                icon: iconSvg,
                tooltip: true
            });
            button.on('execute', ()=>{
                this._showTooltipBalloon();
            });
            return button;
        });
        // Handle clicking on existing tooltips
        // Use document click handler for better reliability
        document.addEventListener('click', (event)=>{
            const target = event.target;
            const tooltipWidget = target.closest('.ck-tooltip-widget');
            if (tooltipWidget && editor.editing.view.document.isFocused) {
                event.preventDefault();
                event.stopPropagation();
                // Get the view element from the widget
                const viewElement = editor.editing.view.domConverter.mapDomToView(tooltipWidget);
                if (viewElement) {
                    // Get the model element
                    const modelElement = editor.editing.mapper.toModelElement(viewElement);
                    if (modelElement) {
                        // Select the tooltip element first
                        editor.model.change((writer)=>{
                            writer.setSelection(modelElement, 'on');
                        });
                        const tooltipContent = modelElement.getAttribute('tooltipContent') || '';
                        this._showTooltipBalloon(tooltipContent, true);
                    }
                }
            }
        });
    }
    _showTooltipBalloon(existingContent = '', isEdit = false) {
        const editor = this.editor;
        // Always create a fresh form to avoid content persistence
        this._formView = new (CssTransitionDisablerMixin(TooltipFormView))(editor.locale, this._getFormValidators());
        // Handle form submission
        const formView = this._formView;
        formView.on('submit', ()=>{
            if (formView.isValid()) {
                const content = formView.content;
                if (isEdit) {
                    editor.execute('editTooltip', {
                        content
                    });
                } else {
                    editor.execute('insertTooltip', {
                        content
                    });
                }
                this._hideBalloon();
            }
        });
        // Handle form cancellation
        formView.on('cancel', ()=>{
            this._hideBalloon();
        });
        // Set form content
        formView.content = existingContent;
        formView.resetFormStatus();
        // Show the balloon
        this._balloon.add({
            view: formView,
            position: this._getBalloonPositionData()
        });
        // Add click outside handler
        this._addClickOutsideHandler();
        // Focus the form
        formView.focus();
    }
    _hideBalloon() {
        if (this._balloon.hasView(this._formView)) {
            this._balloon.remove(this._formView);
        }
        // Remove click outside handler
        this._removeClickOutsideHandler();
        // Clean up the form
        if (this._formView) {
            this._formView.destroy();
            this._formView = undefined;
        }
        // Focus back to editor
        this.editor.editing.view.focus();
    }
    _getBalloonPositionData() {
        const view = this.editor.editing.view;
        const selection = view.document.selection;
        const range = selection.getFirstRange();
        if (range) {
            return {
                target: view.domConverter.viewRangeToDom(range),
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
            target: this.editor.ui.getEditableElement(),
            positions: [
                BalloonPanelView.defaultPositions.northArrowSouth
            ]
        };
    }
    _addClickOutsideHandler() {
        this._clickOutsideHandler = (event)=>{
            const target = event.target;
            const balloonElement = this._balloon?.view?.element;
            if (balloonElement && !balloonElement.contains(target)) {
                this._hideBalloon();
            }
        };
        document.addEventListener('click', this._clickOutsideHandler, true);
    }
    _removeClickOutsideHandler() {
        if (this._clickOutsideHandler) {
            document.removeEventListener('click', this._clickOutsideHandler, true);
            this._clickOutsideHandler = undefined;
        }
    }
    _getFormValidators() {
        const t = this.editor.t;
        return [
            (form)=>{
                if (!form.content.length) {
                    return t('Tooltip content cannot be empty.');
                }
            }
        ];
    }
}
class InsertTooltipCommand extends Command {
    execute(options = {}) {
        const model = this.editor.model;
        model.change((writer)=>{
            const tooltipElement = writer.createElement('tooltip', {
                tooltipContent: options.content || ''
            });
            model.insertContent(tooltipElement);
            writer.setSelection(tooltipElement, 'after');
        });
    }
    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;
        const allowedIn = model.schema.findAllowedParent(selection.getFirstPosition(), 'tooltip');
        this.isEnabled = allowedIn !== null;
    }
}
class EditTooltipCommand extends Command {
    execute(options = {}) {
        const model = this.editor.model;
        const selection = model.document.selection;
        // Find the selected tooltip element - check both selected element and parent
        let tooltipElement = null;
        // First check if we have a direct selection on the tooltip
        const selectedElement = selection.getSelectedElement();
        if (selectedElement && selectedElement.name === 'tooltip') {
            tooltipElement = selectedElement;
        } else {
            // Fallback to checking parent
            const parent = selection.getFirstPosition()?.parent;
            if (parent && parent.name === 'tooltip') {
                tooltipElement = parent;
            }
        }
        if (tooltipElement) {
            model.change((writer)=>{
                writer.setAttribute('tooltipContent', options.content || '', tooltipElement);
            });
        }
    }
    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;
        // Check both selected element and parent
        const selectedElement = selection.getSelectedElement();
        const parentElement = selection.getFirstPosition()?.parent;
        this.isEnabled = selectedElement?.name === 'tooltip' || parentElement?.name === 'tooltip';
    }
}
class TooltipFormView extends View {
    focusTracker;
    keystrokes;
    contentInputView;
    saveButtonView;
    cancelButtonView;
    children;
    _validators;
    constructor(locale, validators = []){
        super(locale);
        // Initialize focus management
        this.focusTracker = new FocusTracker();
        this.keystrokes = new KeystrokeHandler();
        this._validators = validators;
        // Create form elements
        this.contentInputView = this._createContentInput();
        this.saveButtonView = this._createSaveButton();
        this.cancelButtonView = this._createCancelButton();
        // Create children collection
        this.children = this.createCollection([
            this._createFormRow([
                this.contentInputView
            ], [
                'ck-form__row_large-top-padding'
            ]),
            this._createInstructionsView(),
            this._createActionsRow([
                this.cancelButtonView,
                this.saveButtonView
            ])
        ]);
        // Set form template
        this.setTemplate({
            tag: 'form',
            attributes: {
                class: [
                    'ck',
                    'ck-form',
                    'ck-tooltip-form',
                    'ck-responsive-form'
                ],
                tabindex: '-1'
            },
            children: this.children
        });
        // Handle Escape key
        this.keystrokes.set('Esc', (_data, cancel)=>{
            this.fire('cancel');
            cancel();
        });
    }
    render() {
        super.render();
        // Enable form submission handling
        submitHandler({
            view: this
        });
        // Register focusable elements
        [
            this.contentInputView,
            this.saveButtonView,
            this.cancelButtonView
        ].forEach((view)=>{
            this.focusTracker.add(view.element);
        });
        // Start listening for keystrokes
        this.keystrokes.listenTo(this.element);
    }
    destroy() {
        super.destroy();
        this.focusTracker.destroy();
        this.keystrokes.destroy();
    }
    focus() {
        this.contentInputView.focus();
    }
    isValid() {
        this.resetFormStatus();
        for (const validator of this._validators){
            const errorText = validator(this);
            if (errorText) {
                this.contentInputView.errorText = errorText;
                return false;
            }
        }
        return true;
    }
    resetFormStatus() {
        this.contentInputView.errorText = null;
    }
    _createContentInput() {
        const t = this.locale?.t || ((key)=>key);
        const labeledTextarea = new LabeledFieldView(this.locale, createLabeledTextarea);
        labeledTextarea.label = t('Tooltip Content');
        labeledTextarea.class = 'ck-labeled-field-view_full-width';
        // Set textarea-specific attributes
        labeledTextarea.fieldView.set({
            minRows: 3,
            maxRows: 8,
            placeholder: t('Enter tooltip content here...')
        });
        // Add custom styling to make textarea full width
        labeledTextarea.extendTemplate({
            attributes: {
                style: 'width: 100%;'
            }
        });
        return labeledTextarea;
    }
    _createSaveButton() {
        const t = this.locale?.t || ((key)=>key);
        const button = new ButtonView(this.locale);
        button.set({
            label: t('Save'),
            withText: true,
            type: 'submit',
            class: 'ck-button-action ck-button-bold'
        });
        button.on('execute', ()=>{
            this.fire('submit');
        });
        return button;
    }
    _createCancelButton() {
        const t = this.locale?.t || ((key)=>key);
        const button = new ButtonView(this.locale);
        button.set({
            label: t('Cancel'),
            withText: true
        });
        button.delegate('execute').to(this, 'cancel');
        return button;
    }
    _createFormRow(children, classNames) {
        const rowView = new View(this.locale);
        rowView.setTemplate({
            tag: 'div',
            attributes: {
                class: [
                    'ck',
                    'ck-form__row',
                    ...classNames
                ]
            },
            children
        });
        return rowView;
    }
    _createActionsRow(children) {
        const actionsView = new View(this.locale);
        actionsView.setTemplate({
            tag: 'div',
            attributes: {
                class: [
                    'ck',
                    'ck-dialog__actions'
                ]
            },
            children
        });
        return actionsView;
    }
    _createInstructionsView() {
        const instructionsView = new View(this.locale);
        instructionsView.setTemplate({
            tag: 'div',
            attributes: {
                class: [
                    'ck',
                    'ck-tooltip-instructions'
                ],
                style: 'display: none;' // Hide the instructions completely
            },
            children: []
        });
        return instructionsView;
    }
    // Getter/setter for form values
    get content() {
        return this.contentInputView.fieldView.element?.value?.trim() || '';
    }
    set content(value) {
        this.contentInputView.fieldView.value = value;
    }
}

const icons = {
    ckeditor
};

export { Tooltip, icons };
//# sourceMappingURL=index.js.map
