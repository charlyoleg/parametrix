// prepare_openjscad.ts

//import { withinZero2Pi } from './angle_utils';
import type { tAtsPoints } from './arc_to_stroke';
import { circle_to_stroke, arc_to_stroke } from './arc_to_stroke';

type tOpenjscadSeg = tAtsPoints;

const approxMaxAngle = Math.PI / 8;
const approxMaxLength = 20.0;

function ojscadSegLine(p2x: number, p2y: number): tOpenjscadSeg {
	const rSeg: tOpenjscadSeg = [[p2x, p2y]];
	return rSeg;
}
function ojscadSegArc(
	cx: number,
	cy: number,
	radius: number,
	aa1: number,
	aa2: number,
	arcCcw: boolean
): tOpenjscadSeg {
	const rSeg = arc_to_stroke(cx, cy, radius, aa1, aa2, arcCcw, approxMaxAngle, approxMaxLength);
	return rSeg;
}
function ojscadSegCircle(cx: number, cy: number, radius: number): tOpenjscadSeg {
	const rSeg = circle_to_stroke(cx, cy, radius, approxMaxAngle, approxMaxLength);
	return rSeg;
}

export type { tOpenjscadSeg };
export { ojscadSegLine, ojscadSegArc, ojscadSegCircle };
