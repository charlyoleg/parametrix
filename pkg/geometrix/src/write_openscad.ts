// write_openscad.ts

//import { withinZero2Pi } from './angle_utils';
import type { tAtsPoints } from './arc_to_stroke';
import { circle_to_stroke, arc_to_stroke } from './arc_to_stroke';

type tOpenscadSeg = tAtsPoints;

// floating precision for OpenScad export
function ff(ifloat: number): string {
	return ifloat.toFixed(4);
}

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
	const rSeg = arc_to_stroke(cx, cy, radius, aa1, aa2, arcCcw, Math.PI / 6, 2.0);
	return rSeg;
}
function oscadSegCircle(cx: number, cy: number, radius: number): tOpenscadSeg {
	const rSeg = circle_to_stroke(cx, cy, radius, Math.PI / 6, 2.0);
	return rSeg;
}

class OpenscadWrite {
	pts: Array<string>;
	ptIdx: Array<string>;
	idx: number;
	constructor() {
		this.pts = [];
		this.ptIdx = [];
		this.idx = 0;
	}
	addContour(ictr: tOpenscadSeg) {
		const pts: Array<string> = [];
		const ptIdx: Array<string> = [];
		for (const pt of ictr) {
			const [px, py] = pt;
			pts.push(`[ ${ff(px)}, ${ff(py)} ]`);
			ptIdx.push(` ${this.idx}`);
			this.idx += 1;
		}
		const ptStr = `[ ${pts.join(',')} ]`;
		const ptIdxStr = `[ ${ptIdx.join(',')} ]`;
		this.pts.push(ptStr);
		this.ptIdx.push(ptIdxStr);
	}
	getFigure(faceId: string): string {
		let rStr = '';
		const aList: Array<string> = [];
		const bList: Array<string> = [];
		for (const idx of this.pts.keys()) {
			const aId = `ca_${faceId}_${idx}`;
			const bId = `cb_${faceId}_${idx}`;
			rStr += `${aId} = ${this.pts[idx]};\n`;
			rStr += `${bId} = ${this.ptIdx[idx]};\n`;
			aList.push(aId);
			bList.push(bId);
		}
		const aListStr = aList.join(', ');
		const bListStr = bList.join(', ');
		rStr += `a_${faceId} = concat(${aListStr});\n`;
		rStr += `b_${faceId} = [${bListStr}];\n`;
		return rStr;
	}
}
function oscadWriter() {
	const rOscadWrite = new OpenscadWrite();
	return rOscadWrite;
}

export type { tOpenscadSeg };
export { oscadSegLine, oscadSegArc, oscadSegCircle, oscadWriter };
