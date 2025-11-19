import './augmentation.js';

export { default as Fullscreen } from './fullscreen.js';

// Re-export icons from the official package
import { IconFullscreenEnter, IconFullscreenLeave } from '@ckeditor/ckeditor5-icons';

export const icons = {
	fullscreenEnter: IconFullscreenEnter,
	fullscreenLeave: IconFullscreenLeave
};
