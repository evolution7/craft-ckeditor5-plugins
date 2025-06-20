# CKEditor 5 Tooltip Plugin

**Part of the [Evolution7 CKEditor 5 Plugins for Craft CMS](../../) collection**

A CKEditor 5 plugin that adds tooltip functionality to rich text editors. Insert interactive tooltip widgets with contextual information.

This plugin is included in the Evolution7 CKEditor 5 Plugins Craft plugin and is automatically available when installed.

## Features

- 🎯 **Interactive Tooltips**: Insert tooltip widgets with clickable info icons
- 📝 **Markdown Support**: Basic markdown-to-HTML conversion for links `[text](url)`
- ✨ **Clean Output**: Semantic HTML with `data-tooltip` attributes
- 🎨 **Customizable**: Easy to style with CSS
- ⌨️ **Keyboard Friendly**: Full keyboard navigation support

## Demo & Preview

The tooltip creates clean, semantic HTML output:

```html
<span class="e7-tooltip" data-tooltip="Your helpful tooltip content">
    <i class="tooltip-icon">ℹ</i>
</span>
```

## Usage in Craft CMS

This plugin is automatically loaded when you install the Evolution7 CKEditor 5 Plugins for Craft CMS. To enable the tooltip functionality:

1. Install the Craft plugin via Composer or the Plugin Store
2. Configure your CKEditor field to include the `tooltip` toolbar item
3. The plugin will be automatically available in your CKEditor instances

## Usage Guide

### Adding Tooltips

1. **Insert New Tooltip**: Click the tooltip button (ℹ) in the toolbar
2. **Edit Content**: A form appears with a textarea for content input
3. **Markdown Links**: Use `[link text](https://example.com)` format for links
4. **Save**: Click "Save" or press Enter to insert the tooltip
5. **Cancel**: Click "Cancel" or press Escape to dismiss

### Editing Existing Tooltips

1. **Click Tooltip**: Click on any existing tooltip icon in the editor
2. **Edit Content**: The editing form opens with current content
3. **Update**: Make changes and click "Save"

### Markdown Support

The plugin supports basic markdown-to-HTML conversion:

```
Input:  Check out [our documentation](https://example.com) for more info
Output: Check out <a href="https://example.com">our documentation</a> for more info
```

## HTML Output

When you save your content, tooltips are converted to clean, semantic HTML:

```html
<span class="e7-tooltip" data-tooltip="This is helpful information">
    <i class="tooltip-icon">ℹ</i>
</span>
```

**With markdown links:**
```html
<span class="e7-tooltip" data-tooltip="Visit &lt;a href=&quot;https://example.com&quot;&gt;our site&lt;/a&gt; for details">
    <i class="tooltip-icon">ℹ</i>
</span>
```

## Styling

### Default Styles

The plugin includes basic CSS styling for the tooltip icon:

```css
.ck-tooltip-icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    color: hsl(201, 97%, 43%);
    background-color: hsl(201, 100%, 94%);
    border-radius: 50%;
    /* ... additional styles */
}
```

### Custom Styling

Override the default styles in your CSS:

```css
/* Customize the tooltip icon */
.tooltip-icon {
    color: #007cba;
    background-color: #e3f2fd;
    border: 1px solid #90caf9;
}

/* Style the tooltip container */
.e7-tooltip {
    position: relative;
    display: inline-block;
}

/* Add hover effects */
.e7-tooltip:hover .tooltip-icon {
    background-color: #bbdefb;
}
```

### Form Styling

The tooltip form has a fixed width and can be customized:

```css
.ck-balloon-panel .ck-tooltip-form {
    width: 300px; /* Fixed width */
}
```

## Development

### Prerequisites

- Node.js 18+ 
- Yarn package manager
- CKEditor 5 framework knowledge

### Setup

```bash
git clone <repository-url>
cd ckeditor5-tooltip
yarn install
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `yarn start` | Start development server with live reload |
| `yarn test` | Run unit tests |
| `yarn test --coverage` | Run tests with coverage report |
| `yarn lint` | Run ESLint code analysis |
| `yarn stylelint` | Run CSS code analysis |
| `yarn build:dist` | Build npm and browser distributions |
| `yarn dll:build` | Build DLL-compatible version |
| `yarn dll:serve` | Serve DLL build for testing |

### Development Workflow

1. **Start Development**: `yarn start`
2. **Make Changes**: Edit files in `src/` or `theme/`
3. **Test Changes**: Browser auto-reloads at `http://localhost:8080`
4. **Run Tests**: `yarn test`
5. **Build**: `yarn build:dist`

## Architecture

### Plugin Structure

```
src/
├── index.ts          # Plugin exports and icons
├── tooltip.ts        # Main plugin implementation
└── augmentation.ts   # TypeScript module augmentation

theme/
├── tooltip.css       # Plugin styling
└── icons/
    └── ckeditor.svg  # Toolbar icon

tests/
├── index.ts          # DLL export tests
└── tooltip.ts        # Plugin functionality tests
```

### Key Components

- **Tooltip Plugin**: Main plugin class extending CKEditor's Plugin
- **TooltipFormView**: Custom form for content input
- **Commands**: InsertTooltipCommand and EditTooltipCommand
- **Schema**: Model definition for tooltip elements
- **Converters**: Bidirectional model ↔ view ↔ data conversion

## Requirements

- **CKEditor 5**: `>=42.0.0`
- **Node.js**: `>=18.0.0`
- **Modern Browsers**: Chrome, Firefox, Safari, Edge

## TypeScript Support

The plugin includes full TypeScript definitions when used within the Craft CMS plugin.

## Browser Support

- Chrome 63+
- Firefox 78+
- Safari 13.1+
- Edge 79+

## Contributing

Contributions to this plugin should be made to the main [Evolution7 CKEditor 5 Plugins](../../) repository.

### Code Style

- Follow ESLint configuration
- Use TypeScript for type safety
- Write tests for new features
- Document public APIs
- Follow CKEditor 5 coding standards

## Troubleshooting

### Common Issues

**Tooltip button not appearing**
- Ensure the plugin is added to both `plugins` and `toolbar` arrays
- Check browser console for errors

**Form not positioning correctly**
- Verify CKEditor 5 version compatibility
- Check for CSS conflicts with form positioning

**TypeScript errors**
- Check CKEditor 5 type definitions are installed
- Verify Craft CMS plugin is properly installed

### Debug Mode

Enable debug mode for additional logging:

```javascript
// Add to browser console
localStorage.setItem('debug', 'ckeditor5:*');
```

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and changes.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- 📖 [CKEditor 5 Documentation](https://ckeditor.com/docs/ckeditor5/)
- 🐛 [Report Issues](https://github.com/sweetroll/ckeditor5-tooltip/issues)
- 💬 [Discussions](https://github.com/sweetroll/ckeditor5-tooltip/discussions)

## Related Packages

- [@ckeditor/ckeditor5-widget](https://www.npmjs.com/package/@ckeditor/ckeditor5-widget) - Widget framework
- [@ckeditor/ckeditor5-ui](https://www.npmjs.com/package/@ckeditor/ckeditor5-ui) - UI components

---

Made with ❤️ for the CKEditor 5 community