<?php
namespace evolution7\tooltip;

use craft\base\Plugin as BasePlugin;
use craft\ckeditor\Plugin as CkeditorPlugin;
use evolution7\tooltip\assets\TooltipAsset;

class Plugin extends BasePlugin
{
    public string $schemaVersion = '1.0.0';

    public function init(): void
    {
        parent::init();
        
        CkeditorPlugin::registerCkeditorPackage(TooltipAsset::class);
    }
}