import { describe, it, expect } from 'vitest';
import { Line, line } from './line';

describe('line module', () => {
	const l1 = new Line(10, 10, Math.PI / 4);
	const l2 = line(20, 20, (3 / 4) * Math.PI);
	it('Line class', () => {
		expect(l1.distanceOrig()).toBeCloseTo(0, 5);
		expect(l2.distanceOrig()).toBeCloseTo(20 * Math.sqrt(2), 5);
	});
});
