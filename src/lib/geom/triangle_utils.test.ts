import { describe, it, expect } from 'vitest';
//import { roundZero } from './angle_utils';
import { rightTriLaFromLbLc } from './triangle_utils';

describe('triangle suit', () => {
	it('right triangle hypothenuse 1', () => {
		expect(rightTriLaFromLbLc(3, 4)).toBeCloseTo(5, 5);
	});
	it('right triangle hypothenuse 2', () => {
		expect(rightTriLaFromLbLc(2, 2)).toBeCloseTo(2.828427, 5);
	});
});
