import type { Fullscreen } from './index.js';

declare module '@ckeditor/ckeditor5-core' {
	interface PluginsMap {
		[ Fullscreen.pluginName ]: Fullscreen;
	}
}
