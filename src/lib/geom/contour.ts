// contour.ts
// contour.ts deals with open and closed path composed of segments and arcs
// contour.ts depends on point.ts, line.ts and vector.ts
// contour.ts is used by figure.ts

import type { tCanvasAdjust } from './canvas_utils';
//import type { tPolar } from './point';
//import { colorCanvasPoint } from '$lib/style/colors.scss';
import { colors, point2canvas } from './canvas_utils';
import {
	//degToRad,
	//radToDeg,
	roundZero,
	//withinZero2Pi,
	withinPiPi,
	withinZeroPi,
	withinHPiHPi
} from './angle_utils';
import {
	//rightTriLaFromLbLc,
	//rightTriLbFromLaLc,
	//lcFromLaLbAc,
	//aCFromLaLbLc,
	//aCFromAaAb
	lbFromLaAaAb
	//aBFromLaLbAa
} from './triangle_utils';
import { point, Point } from './point';
import { line, Line } from './line';
import { vector, Vector } from './vector';

enum SegEnum {
	eStroke,
	eArc,
	ePointed,
	eRounded,
	eWidened,
	eStart
}

/* Segment class */

class Segment {
	sType: SegEnum;
	px: number;
	py: number;
	radius: number;
	arcLarge: boolean;
	arcCcw: boolean;
	constructor(
		iType: SegEnum,
		ix: number,
		iy: number,
		iRadius: number,
		iArcLarge = false,
		iArcCcw = false
	) {
		this.sType = iType;
		this.px = ix;
		this.py = iy;
		this.radius = iRadius;
		this.arcLarge = iArcLarge;
		this.arcCcw = iArcCcw;
	}
}

function stroke(ix: number, iy: number) {
	return new Segment(SegEnum.eStroke, ix, iy, 0);
}
function arc(ix: number, iy: number, iRadius: number, iLarge: boolean, iCcw: boolean) {
	return new Segment(SegEnum.eArc, ix, iy, iRadius, iLarge, iCcw);
}
function pointed() {
	return new Segment(SegEnum.ePointed, 0, 0, 0);
}
function rounded(iRadius: number) {
	return new Segment(SegEnum.eRounded, 0, 0, iRadius);
}
function widened(iRadius: number) {
	return new Segment(SegEnum.eWidened, 0, 0, iRadius);
}

/* Contour class */

class Contour {
	segments: Array<Segment>;
	constructor(ix: number, iy: number) {
		this.segments = [new Segment(SegEnum.eStart, ix, iy, 0)];
	}
	add(iSeg: Segment) {
		this.segments.push(iSeg);
	}
	close(iSeg: Segment) {
		iSeg.px = this.segments[0].px;
		iSeg.py = this.segments[0].py;
		this.segments.push(iSeg);
	}
	draw(ctx: CanvasRenderingContext2D, cAdjust: tCanvasAdjust, color: string = colors.contour) {
		let px1 = 0;
		let py1 = 0;
		for (const seg of this.segments) {
			if (seg.sType === SegEnum.eStroke) {
				const [cx1, cy1] = point2canvas(px1, py1, cAdjust);
				const [cx2, cy2] = point2canvas(seg.px, seg.py, cAdjust);
				ctx.beginPath();
				ctx.moveTo(cx1, cy1);
				ctx.lineTo(cx2, cy2);
				ctx.strokeStyle = color;
				ctx.stroke();
			}
			if (seg.sType === SegEnum.eArc) {
				const [cx, cy] = point2canvas(px1, py1, cAdjust);
				const radius = seg.radius;
				const a1 = 0;
				const a2 = Math.PI;
				const ccw = seg.arcCcw;
				ctx.beginPath();
				ctx.arc(cx, cy, radius, a1, a2, ccw);
				ctx.strokeStyle = color;
				ctx.stroke();
			}
			if (
				seg.sType === SegEnum.eStroke ||
				seg.sType === SegEnum.eArc ||
				seg.sType === SegEnum.eStart
			) {
				px1 = seg.px;
				py1 = seg.py;
			}
		}
	}
	extractSkeleton(): Contour {
		const seg0 = this.segments[0];
		const rContour = new Contour(seg0.px, seg0.py);
		for (const seg of this.segments) {
			if (seg.sType === SegEnum.eStroke || seg.sType === SegEnum.eArc) {
				rContour.add(seg);
			}
		}
		return rContour;
	}
	extractPoints(): Array<Point> {
		const rPoints = [];
		const seg0 = this.segments[0];
		rPoints.push(point(seg0.px, seg0.py));
		for (const seg of this.segments) {
			if (
				seg.sType === SegEnum.eStroke ||
				seg.sType === SegEnum.eArc ||
				seg.sType === SegEnum.eStart
			) {
				rPoints.push(point(seg.px, seg.py));
			}
		}
		return rPoints;
	}
}

function contour(ix: number, iy: number) {
	return new Contour(ix, iy);
}

export { stroke, arc, pointed, rounded, widened, Contour, contour };
