<?php
namespace evolution7\tooltip\assets;

use craft\ckeditor\web\assets\BaseCkeditorPackageAsset;

class TooltipAsset extends BaseCkeditorPackageAsset
{
    public $sourcePath = '@evolution7/tooltip/web/assets/tooltip/dist';

    public $js = [
        'browser/index.js',
    ];

    public array $pluginNames = [
        'Tooltip',
    ];

    public array $toolbarItems = [
        'tooltip',
    ];
}