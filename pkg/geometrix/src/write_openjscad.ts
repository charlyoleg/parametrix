// write_openjscad.ts

//import { withinZero2Pi } from './angle_utils';
import type { tAtsPoints } from './arc_to_stroke';
import { circle_to_stroke, arc_to_stroke } from './arc_to_stroke';

type tOpenjscadSeg = tAtsPoints;

const approxMaxAngle = Math.PI / 8;
const approxMaxLength = 20.0;

// floating precision for OpenScad export
function ff(ifloat: number): string {
	return ifloat.toFixed(4);
}

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

class OpenjscadWrite {
	pts: Array<string>;
	constructor() {
		this.pts = [];
	}
	addContour(ictr: tOpenjscadSeg) {
		const pts2: Array<string> = [];
		for (const pt of ictr) {
			const [px, py] = pt;
			pts2.push(`[ ${ff(px)}, ${ff(py)} ]`);
		}
		const ptStr = `[ ${pts2.join(',')} ]`;
		this.pts.push(ptStr);
	}
	getFigure(faceId: string): string {
		let rStr = '';
		const aList: Array<string> = [];
		for (const idx of this.pts.keys()) {
			const aId = `ctr_${faceId}_${idx}`;
			rStr += `const ${aId} = polygon({ points: ${this.pts[idx]} });\n`;
			aList.push(aId);
		}
		if (aList.length > 1) {
			rStr += `const face_${faceId} = ctr_${faceId}_0;\n`;
		} else {
			const ctrList = aList.join(', ');
			rStr += `const face_${faceId} = subtract( ${ctrList} )\n`;
		}
		return rStr;
	}
}
function ojscadWriter() {
	const rOjscadWrite = new OpenjscadWrite();
	return rOjscadWrite;
}

export type { tOpenjscadSeg };
export { ojscadSegLine, ojscadSegArc, ojscadSegCircle, ojscadWriter };
