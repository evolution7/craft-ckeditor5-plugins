<?php
namespace evolution7\ckeditor5plugins\assets;

use craft\ckeditor\web\assets\BaseCkeditorPackageAsset;

class FullscreenAsset extends BaseCkeditorPackageAsset
{
    public $sourcePath = '@evolution7/ckeditor5plugins/assets/plugins/ckeditor5-fullscreen';

    public $js = [
        'fullscreen.js',
    ];

    public array $pluginNames = [
        'Fullscreen',
    ];

    public array $toolbarItems = [
        'fullscreen',
    ];
}
