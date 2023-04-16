import { describe, it, expect } from 'vitest';
import {
	degToRad,
	radToDeg,
	roundZero,
	withinZero2Pi,
	withinPiPi,
	withinZeroPi,
	withinHPiHPi
} from './angle_utils';

describe('angle suit', () => {
	it('radian to degree', () => {
		expect(radToDeg(Math.PI / 6)).toBeCloseTo(30, 5);
	});
	it('degree to radian', () => {
		expect(degToRad(-45)).toBeCloseTo(-Math.PI / 4, 5);
	});
	it('roundZero', () => {
		expect(roundZero(degToRad(90) - Math.PI / 2)).toBe(0);
	});
	it('withinZero2Pi 1', () => {
		expect(withinZero2Pi(Math.PI / 3)).toBeCloseTo(Math.PI / 3, 5);
	});
});
