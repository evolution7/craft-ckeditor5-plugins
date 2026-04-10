(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('ckeditor5')) :
	typeof define === 'function' && define.amd ? define(['exports', 'ckeditor5'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.CKFullscreen = {}, global.CKEDITOR));
})(this, (function (exports, ckeditor5) { 'use strict';

	const o={fullscreenEnter:ckeditor5.IconFullscreenEnter,fullscreenLeave:ckeditor5.IconFullscreenLeave};

	Object.defineProperty(exports, "Fullscreen", {
		enumerable: true,
		get: function () { return ckeditor5.Fullscreen; }
	});
	exports.icons = o;

}));
//# sourceMappingURL=index.umd.js.map
