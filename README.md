# CKEditor 5 Plugins for Craft CMS

A collection of CKEditor 5 plugins packaged as a Craft CMS plugin. This plugin provides a wrapper that makes it easy to add multiple CKEditor 5 plugins to your Craft CMS installation.

## Included Plugins

- **Tooltip Plugin** - Add interactive tooltips with info icons to your rich text content

## Features

- **Multiple CKEditor 5 plugins** - Easily add and manage multiple CKEditor 5 plugins
- **DLL-compatible builds** - Uses optimized DLL builds for better performance
- **Automatic registration** - Plugins are automatically registered with Craft's CKEditor integration
- **Extensible architecture** - Easy to add new plugins to the collection

## Requirements

- Craft CMS 5.0+
- CKEditor plugin 4.0+
- CKEditor 5 (>=42.0.0)
- Modern browsers (Chrome, Firefox, Safari, Edge)

## Installation

1. Install via Composer:
   ```bash
   composer require evolution7/craft-ckeditor5-plugins
   ```

2. Install the plugin in the Craft Control Panel under Settings → Plugins, or from the command line:
   ```bash
   ./craft plugin/install craft-ckeditor5-plugins
   ```

## Usage

1. Go to Settings → Fields in your Craft Control Panel
2. Create or edit a CKEditor field
3. Add the desired plugin toolbar items to your CKEditor configuration:
   - `tooltip` - For the tooltip plugin

The plugins will automatically be available in your CKEditor instances.

## Available Plugins

### Tooltip Plugin

Add interactive tooltips with info icons to your content.

**Toolbar item:** `tooltip`

**Features:**
- Interactive tooltip widgets with info icons (ℹ)
- Keyboard accessibility support
- Edit existing tooltips by clicking them
- Clean semantic HTML output

**Output:**
```html
<span class="e7-tooltip" data-tooltip="Your tooltip content">
    <i class="tooltip-icon">ℹ</i>
</span>
```

## Development

### Adding New Plugins

To add a new CKEditor 5 plugin to this collection:

1. **Generate the plugin structure** using the CKEditor 5 package generator:
   ```bash
   npx ckeditor5-package-generator@latest <packageName> --use-yarn --lang ts
   ```

2. **Place the plugin** in the `plugins/` directory of this repository

3. **Build the DLL version** of your plugin:
   ```bash
   cd plugins/<your-plugin>
   yarn dll:build
   ```

4. **Create a Package Asset class** in `src/assets/` (e.g., `YourPluginAsset.php`):
   ```php
   <?php
   namespace evolution7\ckeditor5plugins\assets;

   use craft\ckeditor\web\assets\BaseCkeditorPackageAsset;

   class YourPluginAsset extends BaseCkeditorPackageAsset
   {
       public $sourcePath = '@evolution7/ckeditor5plugins/plugins/<your-plugin>/build';

       public $js = [
           '<your-plugin>.js', // The DLL build file
       ];

       public array $pluginNames = [
           'YourPluginClassName', // From ckeditor5-metadata.json
       ];

       public array $toolbarItems = [
           'yourToolbarItem', // From ckeditor5-metadata.json
       ];
   }
   ```

5. **Register the asset** in `src/Plugin.php`:
   ```php
   use evolution7\ckeditor5plugins\assets\YourPluginAsset;

   public function init(): void
   {
       parent::init();
       
       // ... existing registrations
       CkeditorPlugin::registerCkeditorPackage(YourPluginAsset::class);
   }
   ```

### Plugin Structure

Each CKEditor 5 plugin should follow this structure:
```
plugins/
└── your-plugin-name/
    ├── build/              # DLL-compatible build files
    │   └── your-plugin.js
    ├── dist/               # Standard build files
    ├── src/                # TypeScript source
    ├── ckeditor5-metadata.json
    └── package.json
```

### Key Points for Development

- **Use Yarn** for consistency across all plugins
- **Build DLL versions** - The Craft plugin uses the `build/` directory files
- **Each plugin needs its own Asset class** - This is required by Craft's CKEditor integration
- **Follow CKEditor 5 standards** - Use the official package generator and follow CKEditor 5 development guidelines
- **Update metadata** - Ensure `ckeditor5-metadata.json` contains correct plugin and toolbar item names

### Development Workflow

1. Generate a new plugin using the CKEditor 5 package generator
2. Develop your plugin following CKEditor 5 guidelines
3. Build the DLL version for Craft integration
4. Create the corresponding Asset class
5. Register the asset in the main Plugin class
6. Test the integration in a Craft CMS environment

## License

MIT

## Support

For bug reports and feature requests, please use the [GitHub issues](https://github.com/evolution7/craft-ckeditor5-plugins/issues) page.