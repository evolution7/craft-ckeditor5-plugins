<?php
namespace evolution7\ckeditor5plugins\assets;

use craft\ckeditor\web\assets\BaseCkeditorPackageAsset;

class TooltipAsset extends BaseCkeditorPackageAsset
{
    public $sourcePath = '@evolution7/ckeditor5plugins/plugins/ckeditor5-tooltip/build';

    public $js = [
        'tooltip.js',
    ];

    public array $pluginNames = [
        'Tooltip',
    ];

    public array $toolbarItems = [
        'tooltip',
    ];
}