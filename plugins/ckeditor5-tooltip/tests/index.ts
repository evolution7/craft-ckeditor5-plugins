import { describe, expect, it } from 'vitest';
import { Tooltip as TooltipDll, icons } from '../src/index.js';
import Tooltip from '../src/tooltip.js';

import ckeditor from './../theme/icons/ckeditor.svg';

describe( 'CKEditor5 Tooltip DLL', () => {
	it( 'exports Tooltip', () => {
		expect( TooltipDll ).to.equal( Tooltip );
	} );

	describe( 'icons', () => {
		it( 'exports the "ckeditor" icon', () => {
			expect( icons.ckeditor ).to.equal( ckeditor );
		} );
	} );
} );
