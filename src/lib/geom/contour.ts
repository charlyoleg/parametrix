// contour.ts
// contour.ts deals with open and closed path composed of segments and arcs
// contour.ts depends on point.ts, line.ts and vector.ts
// contour.ts is used by figure.ts

import type { tCanvasAdjust } from './canvas_utils';
//import type { tPolar } from './point';
//import { colorCanvasPoint } from '$lib/style/colors.scss';
import { colors, point2canvas, radius2canvas } from './canvas_utils';
//import {
//	//degToRad,
//	//radToDeg,
//	roundZero,
//	//withinZero2Pi,
//	withinPiPi,
//	withinZeroPi,
//	withinHPiHPi
//} from './angle_utils';
import {
	//rightTriLaFromLbLc,
	rightTriLbFromLaLc
	//lcFromLaLbAc,
	//aCFromLaLbLc,
	//aCFromAaAb,
	//lbFromLaAaAb,
	//aBFromLaLbAa
} from './triangle_utils';
import { point, Point } from './point';
//import { line, Line } from './line';
//import { vector, Vector } from './vector';

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

function toCanvasArc(
	px1: number,
	py1: number,
	px2: number,
	py2: number,
	radius: number,
	arcLarge: boolean,
	arcCcw: boolean
) {
	const p1 = point(px1, py1);
	const p2 = point(px2, py2);
	const lp1p2h = p1.distanceToPoint(p2) / 2;
	if (p1.isEqual(p2)) {
		throw `err638: no equidistance because identical point ${p1.cx} ${p2.cy}`;
	}
	if (radius < lp1p2h) {
		throw `err399: radius ${radius} smaller than lp1p2h ${lp1p2h}`;
	}
	const pbi = p1.middlePoint(p2);
	const abi = p1.angleToPoint(p2) + Math.PI / 2;
	const oppos = rightTriLbFromLaLc(radius, lp1p2h);
	const rp1 = pbi.translatePolar(abi, oppos);
	const rp2 = pbi.translatePolar(abi + Math.PI, oppos);
	let rp3 = rp1;
	if ((!arcLarge && !arcCcw) || (arcLarge && arcCcw)) {
		rp3 = rp2;
	}
	const px3 = rp3.cx;
	const py3 = rp3.cy;
	const a1 = rp3.angleToPoint(p1);
	const a2 = rp3.angleToPoint(p2);
	return [px3, py3, a1, a2];
}

/* AContour abstract class */

abstract class AContour {
	abstract draw(ctx: CanvasRenderingContext2D, cAdjust: tCanvasAdjust, color: string): void;
	abstract extractSkeleton(): AContour;
	abstract generateContour(): AContour;
	abstract generatePoints(): Array<Point>;
}

/* Contour class */

class Contour extends AContour {
	segments: Array<Segment>;
	constructor(ix: number, iy: number) {
		super();
		this.segments = [new Segment(SegEnum.eStart, ix, iy, 0)];
	}
	add(iSeg: Segment) {
		this.segments.push(iSeg);
	}
	addSegStroke(ix: number, iy: number) {
		const seg = new Segment(SegEnum.eStroke, ix, iy, 0);
		this.add(seg);
	}
	addSegArc(ix: number, iy: number, iRadius: number, iLarge: boolean, iCcw: boolean) {
		const seg = new Segment(SegEnum.eArc, ix, iy, iRadius, iLarge, iCcw);
		this.add(seg);
	}
	addCornerPointed() {
		const seg = new Segment(SegEnum.ePointed, 0, 0, 0);
		this.add(seg);
	}
	addCornerRounded(iRadius: number) {
		const seg = new Segment(SegEnum.eRounded, 0, 0, iRadius);
		this.add(seg);
	}
	addCornerWidened(iRadius: number) {
		const seg = new Segment(SegEnum.eWidened, 0, 0, iRadius);
		this.add(seg);
	}
	closeSegStroke() {
		const px = this.segments[0].px;
		const py = this.segments[0].py;
		this.addSegStroke(px, py);
	}
	closeSegArc(iRadius: number, iLarge: boolean, iCcw: boolean) {
		const px = this.segments[0].px;
		const py = this.segments[0].py;
		this.addSegArc(px, py, iRadius, iLarge, iCcw);
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
				const [px3, py3, a1, a2] = toCanvasArc(
					px1,
					py1,
					seg.px,
					seg.py,
					seg.radius,
					seg.arcLarge,
					seg.arcCcw
				);
				const [cx3, cy3] = point2canvas(px3, py3, cAdjust);
				ctx.beginPath();
				ctx.arc(cx3, cy3, seg.radius, a1, a2, seg.arcCcw);
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
	generateContour(): Contour {
		const rContour = this.extractSkeleton(); // TODO
		return rContour;
	}
	generatePoints(): Array<Point> {
		// TODO
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

/* ContourCircle class */

class ContourCircle extends AContour {
	px: number;
	py: number;
	radius: number;
	constructor(ix: number, iy: number, iRadius: number) {
		super();
		this.px = ix;
		this.py = iy;
		this.radius = iRadius;
	}
	draw(ctx: CanvasRenderingContext2D, cAdjust: tCanvasAdjust, color: string = colors.contour) {
		const [cx3, cy3] = point2canvas(this.px, this.py, cAdjust);
		const cRadius = radius2canvas(this.radius, cAdjust);
		ctx.beginPath();
		ctx.arc(cx3, cy3, cRadius, 0, 2 * Math.PI, true);
		ctx.strokeStyle = color;
		ctx.stroke();
	}
	extractSkeleton(): ContourCircle {
		const rContour = new ContourCircle(this.px, this.py, this.radius);
		return rContour;
	}
	generateContour(): ContourCircle {
		const rContour = new ContourCircle(this.px, this.py, this.radius);
		return rContour;
	}
	generatePoints(): Array<Point> {
		const rPoints = [];
		const p1 = point(this.px, this.py);
		rPoints.push(p1);
		for (let i = 0; i < 4; i++) {
			const p2 = p1.translatePolar((i * Math.PI) / 2, this.radius);
			rPoints.push(p2);
		}
		return rPoints;
	}
}

// instantiation functions
function contour(ix: number, iy: number) {
	return new Contour(ix, iy);
}
function contourCircle(ix: number, iy: number, iRadius: number) {
	return new ContourCircle(ix, iy, iRadius);
}

type tContour = Contour | ContourCircle;

export type { tContour };
export { Contour, ContourCircle, contour, contourCircle };
