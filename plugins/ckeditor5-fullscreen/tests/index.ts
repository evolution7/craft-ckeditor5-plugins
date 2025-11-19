import { describe, expect, it } from 'vitest';
import { Fullscreen as FullscreenDll, icons } from '../src/index.js';
import Fullscreen from '../src/fullscreen.js';

import ckeditor from './../theme/icons/ckeditor.svg';

describe( 'CKEditor5 Fullscreen DLL', () => {
	it( 'exports Fullscreen', () => {
		expect( FullscreenDll ).to.equal( Fullscreen );
	} );

	describe( 'icons', () => {
		it( 'exports the "ckeditor" icon', () => {
			expect( icons.ckeditor ).to.equal( ckeditor );
		} );
	} );
} );
