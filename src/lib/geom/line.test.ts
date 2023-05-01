import { describe, it, expect } from 'vitest';
import { Line, line } from './line';
import { point } from './point';

describe('line module', () => {
	const l1 = new Line(10, 10, Math.PI / 4);
	const l2 = line(20, 20, (3 / 4) * Math.PI);
	const p1 = point(30, 30);
	const p2 = point(30, -30);
	it('Line construction', () => {
		expect(() => new Line(0, 0, 0).setFromPoints(p1, p1)).toThrowError(/err434/);
		expect(new Line(0, 0, 0).setFromPoints(p2, p1).ca).toBeCloseTo(Math.PI / 2, 5);
	});
	it('Line Axis X and Y intersection', () => {
		expect(l1.getAxisXIntersection()).toBeCloseTo(0, 5);
		expect(l2.getAxisXIntersection()).toBeCloseTo(40, 5);
		expect(l1.getAxisYIntersection()).toBeCloseTo(0, 5);
		expect(l2.getAxisYIntersection()).toBeCloseTo(40, 5);
	});
	it('Line distance to Origine', () => {
		expect(l1.distanceOrig()).toBeCloseTo(0, 5);
		expect(l2.distanceOrig()).toBeCloseTo(20 * Math.sqrt(2), 5);
	});
});
