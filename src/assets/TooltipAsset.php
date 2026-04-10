<?php
namespace evolution7\ckeditor5plugins\assets;

use craft\ckeditor\web\assets\BaseCkeditorPackageAsset;

class TooltipAsset extends BaseCkeditorPackageAsset
{
    public $sourcePath = '@evolution7/ckeditor5plugins/assets/plugins/ckeditor5-tooltip';

    public string $namespace = '@evolution7/ckeditor5-tooltip';

    public $js = [
        ['index.js', 'type' => 'module'],
    ];

    public array $pluginNames = [
        'Tooltip',
    ];

    public array $toolbarItems = [
        'tooltip',
    ];
}