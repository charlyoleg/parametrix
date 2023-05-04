import { describe, it, expect } from 'vitest';
//import type { tPolar } from './point';
import { Point, point } from './point';

describe('point module', () => {
	const p1 = new Point(5, 5);
	const p2 = point(8, 9);
	const p3 = point(25, 25);
	it('Point class basic', () => {
		expect(p1.distanceOrig()).toBeCloseTo(5 * Math.sqrt(2), 5);
		expect(p1.isEqual(p1)).toBe(true);
	});
	it('distanceToPoint function', () => {
		expect(p1.distanceToPoint(p2)).toBeCloseTo(5);
	});
	it('angleTpPoint function', () => {
		expect(p1.angleToPoint(p3)).toBeCloseTo(Math.PI / 4, 5);
	});
	const p4 = point(5, -1);
	it('point creation middle', () => {
		expect(p1.middlePoint(p4).isEqual(point(5, 2))).toBeTruthy;
	});
	it('point creation equidistance', () => {
		expect(() => p1.equidistantPoint(p4, 2, p2)).toThrowError(/err392/);
		expect(p1.equidistantPoint(p4, 10, p2).isEqual(point(13, 2))).toBeTruthy;
	});
});
