import { describe, it, expect, expectTypeOf } from 'vitest';
//import type { tContour } from '$lib/geom/figure';
import * as welem from './wheelElements';

describe('wheelElements module', () => {
	it('axisTorque', () => {
		expectTypeOf(welem.axisTorque(0, 0, 10, 2, 4, 3, 1, 1)).toBeObject();
	});
	it('hollowStraight', () => {
		const args = [0, 0, 20, 40, 1, 3, 1] as const;
		expect(welem.hollowStraightArea(...args)).toBeCloseTo(65);
		expectTypeOf(welem.hollowStraight(...args)).toBeArray();
	});
});
