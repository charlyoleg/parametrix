import { describe, it, expect } from 'vitest';
//import type { tPolar } from './point';
import { Point, point, distancePoints, anglePoints } from './point';

describe('point module', () => {
	const p1 = new Point(5, 5);
	const p2 = point(8, 9);
	const p3 = point(25, 25);
	it('Point class', () => {
		expect(p1.distanceOrig()).toBeCloseTo(5 * Math.sqrt(2), 5);
		expect(p1.isEqual(p1)).toBe(true);
	});
	it('distancePoints function', () => {
		expect(distancePoints(p1, p2)).toBeCloseTo(5);
	});
	it('anglePoints function', () => {
		expect(anglePoints(p1, p3)).toBeCloseTo(Math.PI / 4, 5);
	});
});
