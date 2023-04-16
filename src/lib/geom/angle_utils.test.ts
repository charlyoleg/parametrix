import { describe, it, expect } from 'vitest';
import { degToRad, radToDeg } from './angle_utils';

describe('angle suit', () => {
	it('radian to degree', () => {
		expect(radToDeg(Math.PI / 6)).toBeCloseTo(30, 5);
	});
	it('degree to radian', () => {
		expect(degToRad(-45)).toBeCloseTo(-Math.PI / 4, 5);
	});
});
