import type { Tooltip } from './index.js';

declare module '@ckeditor/ckeditor5-core' {
	interface PluginsMap {
		[ Tooltip.pluginName ]: Tooltip;
	}
}
