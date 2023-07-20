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
	oStr: string;
	constructor() {
		this.oStr = '0\nSECTION\n2\nENTITIES\n';
	}
	addCircle(cx: number, cy: number, radius: number) {
		this.oStr += '0\nCIRCLE\n8\nPARAMETRIX\n';
		this.oStr += `10\n${ff(cx)}\n20\n${ff(cy)}\n40\n${ff(radius)}\n`;
	}
	addLine(p1x: number, p1y: number, p2x: number, p2y: number) {
		this.oStr += '0\nLINE\n8\nPARAMETRIX\n';
		this.oStr += `10\n${ff(p1x)}\n20\n${ff(p1y)}\n11\n${ff(p2x)}\n21\n${ff(p2y)}\n`;
	}
	addArc(cx: number, cy: number, ra: number, a1: number, a2: number) {
		this.oStr += '0\nARC\n8\nPARAMETRIX\n';
		this.oStr += `10\n${ff(cx)}\n20\n${ff(cy)}\n40\n${ff(ra)}\n50\n${ff(a1)}\n51\n${ff(a2)}\n`;
	}
	close() {
		this.oStr += '0\nENDSEC\n0\nEOF\n';
	}
	stringify(): string {
		this.close();
		return this.oStr;
	}
}

function oscadWriter() {
	const rOscadWrite = new OpenscadWrite();
	return rOscadWrite;
}

export type { tOpenscadSeg };
export { oscadSegLine, oscadSegArc, oscadSegCircle, oscadWriter };
