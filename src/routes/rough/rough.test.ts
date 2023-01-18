import { describe, it, expect } from 'vitest';
//import { area } from './geom';
import { area } from './+page.svelte';

describe('area test-1', () => {
	it('area of 3*4 to 12.00', () => {
		expect(area(3, 4)).toBe('12.00');
	});
});
