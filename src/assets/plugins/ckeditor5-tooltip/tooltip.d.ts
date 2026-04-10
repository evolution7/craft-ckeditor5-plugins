import { Plugin, ContextualBalloon, Widget } from 'ckeditor5';
import '../theme/tooltip.css';
export default class Tooltip extends Plugin {
    private _formView?;
    private _balloon?;
    private _clickOutsideHandler?;
    static get requires(): readonly [typeof Widget, typeof ContextualBalloon];
    static get pluginName(): "Tooltip";
    init(): void;
    private _defineSchema;
    private _defineConverters;
    private _defineCommands;
    private _defineUI;
    _showTooltipBalloon(existingContent?: string, isEdit?: boolean): void;
    private _hideBalloon;
    private _getBalloonPositionData;
    private _addClickOutsideHandler;
    private _removeClickOutsideHandler;
    private _getFormValidators;
}
