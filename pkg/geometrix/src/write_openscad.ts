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
		let ptStr = '[';
		let ptIdxStr = '[';
		let sFlag = false;
		for (const pt of ictr) {
			if (!sFlag) {
				sFlag = true;
			} else {
				ptStr += ',';
				ptIdxStr += ',';
			}
			const [px, py] = pt;
			ptStr += ` [ ${ff(px)}, ${ff(py)} ]`;
			ptIdxStr += ` ${this.idx}`;
			this.idx += 1;
		}
		ptStr += ' ]';
		ptIdxStr += ' ]';
		this.pts.push(ptStr);
		this.ptIdx.push(ptIdxStr);
	}
	getFigure(): [Array<string>, Array<string>] {
		return [this.pts, this.ptIdx];
	}
}
function oscadWriter() {
	const rOscadWrite = new OpenscadWrite();
	return rOscadWrite;
}

export type { tOpenscadSeg };
export { oscadSegLine, oscadSegArc, oscadSegCircle, oscadWriter };
