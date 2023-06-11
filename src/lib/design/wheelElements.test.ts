import { describe, it, expect, expectTypeOf } from 'vitest';
//import type { tContour } from '$lib/geom/figure';
import * as welem from './wheelElements';

describe('wheelElements module', () => {
	it('axisTorque', () => {
		expectTypeOf(welem.axisTorque(0, 0, 10)).toBeObject();
	});
	it('hollowStraight', () => {
		const args = [0, 0, 20, 40] as const;
		expect(welem.hollowStraightArea(...args)).toBeCloseTo(60);
		expectTypeOf(welem.hollowStraight(...args)).toBeArray();
	});
});
