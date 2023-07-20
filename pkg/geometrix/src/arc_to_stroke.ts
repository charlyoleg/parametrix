// arc_to_stroke.ts

import { withinZero2Pi } from './angle_utils';

type tAtsPoints = Array<[number, number]>;

function calcAngleStep(
	max_angle: number,
	max_length: number,
	radius: number,
	arc_angle: number
): [number, number] {
	const max_angle2 = 2 * Math.asin(max_length / (2 * radius));
	const angleStepMax = Math.min(max_angle, max_angle2);
	const angleNbMin = arc_angle / angleStepMax;
	const angleNb = angleNbMin + 1;
	const angleStep = arc_angle / angleNb;
	return [angleNb, angleStep];
}

function circle_to_stroke(
	cx: number,
	cy: number,
	radius: number,
	max_angle = Math.PI / 6,
	max_length = 2.0
): tAtsPoints {
	const [angleNb, angleStep] = calcAngleStep(max_angle, max_length, radius, 2 * Math.PI);
	const rPoints: tAtsPoints = [];
	for (let i = 0; i < angleNb; i++) {
		const px = cx + radius * Math.cos(i * angleStep);
		const py = cy + radius * Math.sin(i * angleStep);
		rPoints.push([px, py]);
	}
	// close the contour
	const p0x = rPoints[0][0];
	const p0y = rPoints[0][1];
	rPoints.push([p0x, p0y]);
	return rPoints;
}

function arc_to_stroke(
	cx: number,
	cy: number,
	radius: number,
	a1: number,
	a2: number,
	ccw: boolean,
	max_angle = Math.PI / 6,
	max_length = 2.0
): tAtsPoints {
	let arc_angle = a2 - a1;
	arc_angle = ccw ? arc_angle : -arc_angle;
	arc_angle = withinZero2Pi(arc_angle);
	const [angleNb, angleStep] = calcAngleStep(max_angle, max_length, radius, arc_angle);
	const angleStepSigned = ccw ? angleStep : -angleStep;
	const angleNb2 = angleNb + 1; // pole and fence
	const rPoints: tAtsPoints = [];
	for (let i = 0; i < angleNb2; i++) {
		const angle = a1 + i * angleStepSigned;
		const px = cx + radius * Math.cos(angle);
		const py = cy + radius * Math.sin(angle);
		rPoints.push([px, py]);
	}
	return rPoints;
}

export type { tAtsPoints };
export { circle_to_stroke, arc_to_stroke };
