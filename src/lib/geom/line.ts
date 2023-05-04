// line.ts
// line.ts deals with lines
// line.ts depends on angle_utils.ts, triangle_utils.ts and point.ts

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

/* Base classes */

class Line {
	cx: number;
	cy: number;
	ca: number;
	constructor(ix: number, iy: number, ia: number) {
		this.cx = ix;
		this.cy = iy;
		this.ca = ia;
	}
	draw(ctx: CanvasRenderingContext2D, cAdjust: tCanvasAdjust, color: string = colors.line) {
		const display_length = ctx.canvas.width * 2;
		const [cx1, cy1] = point2canvas(
			this.cx - display_length * Math.cos(this.ca),
			this.cy - display_length * Math.sin(this.ca),
			cAdjust
		);
		const [cx2, cy2] = point2canvas(
			this.cx + 2 * display_length * Math.cos(this.ca),
			this.cy + 2 * display_length * Math.sin(this.ca),
			cAdjust
		);
		ctx.beginPath();
		ctx.moveTo(cx1, cy1);
		ctx.lineTo(cx2, cy2);
		ctx.strokeStyle = color;
		ctx.stroke();
	}
	setFromPoints(p1: Point, p2: Point) {
		this.cx = p1.cx;
		this.cy = p1.cy;
		this.ca = p1.angleToPoint(p2);
		return this;
	}
	getAxisXIntersection() {
		let rX = Infinity;
		if (roundZero(withinHPiHPi(this.ca)) !== 0) {
			const p1 = new Point(this.cx, this.cy);
			const l1ca = withinZeroPi(this.ca);
			const aC = p1.angleOrig();
			const la = p1.distanceOrig();
			if (roundZero(la) === 0) {
				rX = 0;
			} else if (roundZero(withinHPiHPi(l1ca - aC)) === 0) {
				rX = 0;
			} else {
				const aA = Math.min(l1ca, Math.PI - l1ca);
				const aB = withinPiPi(l1ca - aC);
				const aB2 = Math.min(Math.abs(aB), Math.PI - Math.abs(aB));
				rX = Math.sign(aB) * lbFromLaAaAb(la, aA, aB2);
			}
		}
		return rX;
	}
	getAxisYIntersection() {
		let rY = Infinity;
		if (roundZero(withinHPiHPi(this.ca - Math.PI / 2)) !== 0) {
			const p1 = new Point(this.cx, this.cy);
			const l1ca = withinHPiHPi(this.ca);
			const aC = p1.angleOrig();
			const la = p1.distanceOrig();
			const angleDiff = withinHPiHPi(l1ca - aC);
			if (roundZero(la) === 0) {
				rY = 0;
			} else if (roundZero(angleDiff) === 0) {
				rY = 0;
			} else {
				const aA = withinZeroPi(l1ca - Math.PI / 2);
				const aB = -1 * withinPiPi(l1ca - aC);
				const aA2 = Math.min(aA, Math.PI - aA);
				const aB2 = Math.min(Math.abs(aB), Math.PI - Math.abs(aB));
				rY = Math.sign(aB) * lbFromLaAaAb(la, aA2, aB2);
			}
		}
		return rY;
	}
	angleOrig(): number {
		// compute direction, i.e. top-side or bottom-side
		const p1 = new Point(this.cx, this.cy);
		const aC = p1.angleOrig();
		const l1ca = withinHPiHPi(this.ca);
		const aB = -1 * withinPiPi(l1ca - aC);
		let direction = 0;
		if (aB < 0) {
			direction = -Math.PI;
		}
		// end of direction calculation
		const ra = withinZeroPi(Math.PI / 2 + this.ca) + direction;
		return ra;
	}
	distanceOrig(): number {
		const a1 = this.angleOrig();
		const p1 = new Point(this.cx, this.cy);
		const a2 = p1.angleOrig();
		const la = p1.distanceOrig();
		const a12 = withinHPiHPi(a2 - a1);
		const rd = la * Math.cos(a12);
		return rd;
	}
	projectOrig(): Point {
		const pa = this.angleOrig();
		const pl = this.distanceOrig();
		return point(0, 0).setPolar(pa, pl);
	}
	// methods inherited from point
	translate(ix: number, iy: number): Line {
		return new Line(this.cx + ix, this.cy + iy, this.ca);
	}
	rotateOrig(ia: number): Line {
		// rotation with the origin as center
		const lPoint2 = new Point(this.cx, this.cy).rotateOrig(ia);
		return new Line(lPoint2.cx, lPoint2.cy, withinPiPi(this.ca + ia));
	}
	scaleOrig(ir: number): Line {
		const lPoint2 = new Point(this.cx, this.cy).scaleOrig(ir);
		return new Line(lPoint2.cx, lPoint2.cy, this.ca);
	}
	rotate(ic: Point, ia: number): Line {
		const lPoint2 = new Point(this.cx, this.cy).rotate(ic, ia);
		return new Line(lPoint2.cx, lPoint2.cy, withinPiPi(this.ca + ia));
	}
	scale(ic: Point, ir: number): Line {
		const lPoint2 = new Point(this.cx, this.cy).scale(ic, ir);
		return new Line(lPoint2.cx, lPoint2.cy, this.ca);
	}
	// end of methods from point
	// line creation
	lineOrthogonal(ic: Point): Line {
		return line(ic.cx, ic.cy, this.ca + Math.PI / 2);
	}
	lineParallel(ic: Point): Line {
		return line(ic.cx, ic.cy, this.ca);
	}
	// orthogonal projection
	angleToPoint(ic: Point): number {
		// compute direction, i.e. top-side or bottom-side
		const p1 = new Point(this.cx, this.cy);
		const aC = p1.angleToPoint(ic);
		const l1ca = withinHPiHPi(this.ca);
		const aB = -1 * withinPiPi(l1ca - aC);
		let direction = 0;
		if (aB > 0) {
			direction = -Math.PI;
		}
		// end of direction calculation
		const ra = withinZeroPi(Math.PI / 2 + this.ca) + direction;
		return ra;
	}
	distanceToPoint(ic: Point): number {
		let rd = 0;
		const p1 = new Point(this.cx, this.cy);
		if (!ic.isEqual(p1)) {
			const a1 = this.angleToPoint(ic);
			const a2 = p1.angleToPoint(ic);
			const la = p1.distanceToPoint(ic);
			const a12 = withinHPiHPi(a2 - a1);
			rd = la * Math.cos(a12);
		}
		return rd;
	}
	projectPoint(ic: Point): Point {
		const pa = this.angleToPoint(ic);
		const pl = this.distanceToPoint(ic);
		const rp = point(0, 0).setPolar(pa, pl).translate(ic.cx, ic.cy);
		return rp;
	}
	// line comparison
	isParallel(il: Line): boolean {
		const rb = roundZero(withinHPiHPi(this.ca - il.ca)) === 0;
		return rb;
	}
	isOrthogonal(il: Line): boolean {
		const rb = roundZero(withinHPiHPi(Math.PI / 2 + this.ca - il.ca)) === 0;
		return rb;
	}
	isEqual(il: Line): boolean {
		const p2 = point(il.cx, il.cy);
		const dist = this.distanceToPoint(p2);
		const rb = roundZero(dist) === 0 && this.isParallel(il);
		return rb;
	}
	// intersection
	intersection(il: Line): Point {
		if (this.isParallel(il)) {
			throw `err902: no intersection, lines are parallel ca1: ${this.ca} ca2: ${il.ca}`;
		}
		const p1 = point(this.cx, this.cy);
		const p2 = point(il.cx, il.cy);
		let rp = point(0, 0);
		if (p1.isEqual(p2)) {
			rp = p1;
		} else {
			const lp1p2 = p1.distanceToPoint(p2);
			const ap1p2 = p1.angleToPoint(p2);
			const a1 = withinZeroPi(this.ca - ap1p2);
			const a2 = withinZeroPi(il.ca - ap1p2);
		}
		return rp;
	}
	bisector(il: Line, ip: Point): Line {
		return line(ip.cx, ip.cy, il.ca);
	}
}

function line(ix: number, iy: number, ia: number) {
	return new Line(ix, iy, ia);
}

function bisector(ip1: Point, ip2: Point) {
	if (ip1.isEqual(ip2)) {
		throw `err546: no bisector with two same points cx: ${ip1.cx} cy: ${ip1.cy}`;
	}
	const pbi = ip1.middlePoint(ip2);
	const abi = withinZeroPi(ip1.angleToPoint(ip2) + Math.PI / 2);
	return new Line(pbi.cx, pbi.cy, abi);
}

/* export */

export { Line, line, bisector };
