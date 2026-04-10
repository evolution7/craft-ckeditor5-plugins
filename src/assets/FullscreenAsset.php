<?php
namespace evolution7\ckeditor5plugins\assets;

use craft\ckeditor\web\assets\BaseCkeditorPackageAsset;

class FullscreenAsset extends BaseCkeditorPackageAsset
{
    public $sourcePath = '@evolution7/ckeditor5plugins/assets/plugins/ckeditor5-fullscreen';

    public string $namespace = '@evolution7/ckeditor5-fullscreen';

    public $js = [
        ['browser/index.js', 'type' => 'module'],
    ];

    public array $pluginNames = [
        'Fullscreen',
    ];

    public array $toolbarItems = [
        'fullscreen',
    ];
}
