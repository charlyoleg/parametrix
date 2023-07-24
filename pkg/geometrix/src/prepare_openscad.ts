// prepare_openscad.ts

//import { withinZero2Pi } from './angle_utils';
import type { tAtsPoints } from './arc_to_stroke';
import { circle_to_stroke, arc_to_stroke } from './arc_to_stroke';

type tOpenscadSeg = tAtsPoints;

const approxMaxAngle = Math.PI / 8;
const approxMaxLength = 20.0;

function oscadSegLine(p2x: number, p2y: number): tOpenscadSeg {
	const rSeg: tOpenscadSeg = [[p2x, p2y]];
	return rSeg;
}
function oscadSegArc(
	cx: number,
	cy: number,
	radius: number,
	aa1: number,
	aa2: number,
	arcCcw: boolean
): tOpenscadSeg {
	const rSeg = arc_to_stroke(cx, cy, radius, aa1, aa2, arcCcw, approxMaxAngle, approxMaxLength);
	return rSeg;
}
function oscadSegCircle(cx: number, cy: number, radius: number): tOpenscadSeg {
	const rSeg = circle_to_stroke(cx, cy, radius, approxMaxAngle, approxMaxLength);
	return rSeg;
}

export type { tOpenscadSeg };
export { oscadSegLine, oscadSegArc, oscadSegCircle };
