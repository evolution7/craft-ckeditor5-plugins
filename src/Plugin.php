<?php
namespace evolution7\ckeditor5plugins;

use craft\base\Plugin as BasePlugin;
use craft\ckeditor\Plugin as CkeditorPlugin;
use evolution7\ckeditor5plugins\assets\TooltipAsset;

class Plugin extends BasePlugin
{
    public string $schemaVersion = '1.0.0';

    public function init(): void
    {
        parent::init();
        
        CkeditorPlugin::registerCkeditorPackage(TooltipAsset::class);
    }
}