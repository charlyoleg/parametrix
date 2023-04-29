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
import { Point, anglePoints } from './point';

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
		this.ca = anglePoints(p1, p2);
		return this;
	}
	getAxisXIntersection() {
		let rX = Infinity;
		if (roundZero(withinHPiHPi(this.ca)) !== 0) {
			const p1 = new Point(this.cx, this.cy);
			const l1ca = withinZeroPi(this.ca);
			const aC = p1.angleOrig();
			const la = p1.distanceOrig();
			if (l1ca > aC) {
				const aA = withinZeroPi(Math.PI - l1ca);
				const aB = withinZeroPi(Math.PI - aA - aC);
				rX = lbFromLaAaAb(la, aA, aB);
			} else {
				const aA = l1ca;
				const aB = withinZeroPi(aC - aA);
				rX = -1 * lbFromLaAaAb(la, aA, aB);
			}
		}
		return rX;
	}
	getAxisYIntersection() {
		let rY = Infinity;
		if (roundZero(withinHPiHPi(this.ca - Math.PI / 2)) !== 0) {
			const p1 = new Point(this.cx, this.cy);
			const l1ca = withinZeroPi(this.ca - Math.PI / 2);
			const aC2 = p1.angleOrig();
			const la = p1.distanceOrig();
			if (l1ca > aC2) {
				const aC = Math.PI / 2 - aC2;
				const aA = this.ca - Math.PI / 2;
				const aB = Math.PI - aA - aC;
				rY = lbFromLaAaAb(la, aA, aB);
			} else {
				const aC = Math.PI / 2 - aC2;
				const aA = this.ca - Math.PI / 2;
				const aB = Math.PI - aA - aC;
				rY = -1 * lbFromLaAaAb(la, aA, aB);
			}
		}
		return rY;
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
	angleOrig(): number {
		const ra = withinPiPi(Math.PI / 2 + this.ca);
		return ra;
	}
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
}

function line(ix: number, iy: number, ia: number) {
	return new Line(ix, iy, ia);
}

/* export */

export { Line, line };
