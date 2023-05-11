import { describe, it, expect } from 'vitest';
import { point } from './point';
import { contour, contourCircle } from './contour';

describe('Contour suit', () => {
	const ctr1 = contour(10, 10);
	ctr1.addPointA(20, 20).addSegStroke();
	ctr1.addPointA(20, 0).addSegStroke();
	ctr1.closeSegStroke();
	it('extractPoints', () => {
		expect(ctr1.generatePoints()[0].isEqual(point(10, 10))).toBeTruthy();
	});
	it('generateContour', () => {
		const ctr2 = ctr1.generateContour();
		expect(ctr2.generatePoints()[0].isEqual(point(10, 10))).toBeTruthy();
	});
});

describe('ContourCircle suit', () => {
	const ctr3 = contourCircle(50, 50, 20);
	it('extractPoints', () => {
		expect(ctr3.generatePoints()[0].isEqual(point(50, 50))).toBeTruthy();
		expect(ctr3.generatePoints()[1].isEqual(point(70, 50))).toBeTruthy();
	});
});
