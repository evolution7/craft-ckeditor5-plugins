# CKEditor 5 Tooltip Plugin for Craft CMS

A Craft CMS plugin that integrates the CKEditor 5 Tooltip widget into your Craft fields, allowing you to add interactive tooltips to your rich text content.

## Features

- **Interactive tooltip widgets** - Add tooltips with an info icon (ℹ) to your CKEditor content
- **Markdown link support** - Supports markdown-style links: `[text](url)` → `<a href="url">text</a>`
- **Keyboard-friendly navigation** - Full keyboard accessibility support
- **Edit existing tooltips** - Click existing tooltip icons to edit their content
- **Clean semantic HTML output** - Generates `<span class="tooltip" data-tooltip="content"><i class="tooltip-icon">ℹ</i></span>`
- **Customizable styling** - Style tooltips to match your site's design

## Requirements

- Craft CMS 5.0+
- CKEditor plugin 4.0+
- CKEditor 5 (>=42.0.0)
- Modern browsers (Chrome, Firefox, Safari, Edge)

## Installation

1. Install via Composer:
   ```bash
   composer require evolution7/craft-ckeditor5-tooltip
   ```

2. Install the plugin in the Craft Control Panel under Settings → Plugins, or from the command line:
   ```bash
   ./craft plugin/install craft-ckeditor5-tooltip
   ```

## Usage

1. Go to Settings → Fields in your Craft Control Panel
2. Create or edit a CKEditor field
3. The tooltip button will automatically appear in the CKEditor toolbar
4. Click the tooltip button (ℹ) to add a tooltip to your content
5. Enter your tooltip content in the dialog that appears
6. Click existing tooltip icons to edit their content

## Output

The plugin generates clean semantic HTML output:
```html
<span class="tooltip" data-tooltip="Your tooltip content here">
    <i class="tooltip-icon">ℹ</i>
</span>
```

You can style the tooltip icons and implement tooltip display functionality using CSS and JavaScript in your frontend templates.

## Styling

The plugin includes basic CSS for the tooltip icons in the editor. For frontend tooltip display, you'll need to implement your own CSS and JavaScript to handle the `data-tooltip` attribute.

Example CSS for basic tooltip display:
```css
.tooltip {
    position: relative;
    cursor: help;
}

.tooltip:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: #333;
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 14px;
    white-space: nowrap;
    z-index: 1000;
}
```

## License

MIT

## Support

For bug reports and feature requests, please use the [GitHub issues](https://github.com/evolution7/craft-ckeditor5-tooltip/issues) page.