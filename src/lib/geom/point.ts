// point.ts
// point.ts deals with points
// point.ts depends on canvas_utils.ts

import type { tCanvasAdjust } from './canvas_utils';
//import { colorCanvasPoint } from '$lib/style/colors.scss';
import { colors, point2canvas } from './canvas_utils';
import { roundZero, withinPiPi } from './angle_utils';

type tPolar = [number, number]; // angle, distance

/* Base classes */
class Point {
	cx: number;
	cy: number;
	constructor(ix: number, iy: number) {
		this.cx = ix;
		this.cy = iy;
	}
	draw(
		ctx: CanvasRenderingContext2D,
		cAdjust: tCanvasAdjust,
		color: string = colors.point,
		shape = 'circle'
	) {
		if (isFinite(this.cx) && isFinite(this.cy)) {
			const radius = ctx.canvas.width * (0.7 / 100);
			const [cx2, cy2] = point2canvas(this.cx, this.cy, cAdjust);
			//console.log(`dbg493: ${cx2} ${cy2}`);
			ctx.beginPath();
			switch (shape) {
				case 'cross':
					ctx.moveTo(cx2 - radius, cy2);
					ctx.lineTo(cx2 + radius, cy2);
					ctx.moveTo(cx2, cy2 - radius);
					ctx.lineTo(cx2, cy2 + radius);
					break;
				case 'rectangle':
					ctx.rect(cx2 - radius, cy2 - radius, 2 * radius, 2 * radius);
					break;
				case 'circle':
				default:
					ctx.arc(cx2, cy2, radius, 0, 2 * Math.PI);
			}
			ctx.strokeStyle = color;
			ctx.stroke();
		} else {
			console.log(`INFO489: point not draw because of infinity ${this.cx} ${this.cy}`);
		}
	}
	distanceOrig(): number {
		return Math.sqrt(this.cx ** 2 + this.cy ** 2);
	}
	angleOrig(): number {
		return Math.atan2(this.cy, this.cx);
	}
	getPolar(): tPolar {
		return [this.angleOrig(), this.distanceOrig()];
	}
	setPolar(ia: number, il: number): Point {
		return new Point(il * Math.cos(ia), il * Math.sin(ia));
	}
	translate(ix: number, iy: number): Point {
		return new Point(this.cx + ix, this.cy + iy);
	}
	translatePolar(ia: number, il: number): Point {
		return new Point(this.cx + il * Math.cos(ia), this.cy + il * Math.sin(ia));
	}
	rotateOrig(ia: number): Point {
		// rotation with the origin as center
		const polar = this.getPolar();
		return this.setPolar(polar[0] + ia, polar[1]);
	}
	scaleOrig(ir: number): Point {
		const polar = this.getPolar();
		return this.setPolar(polar[0], polar[1] * ir);
	}
	rotate(ic: Point, ia: number): Point {
		const p1 = this.translate(-1 * ic.cx, -1 * ic.cy);
		const polar = p1.getPolar();
		const p2 = this.setPolar(polar[0] + ia, polar[1]);
		return p2.translate(ic.cx, ic.cy);
	}
	scale(ic: Point, ir: number): Point {
		const p1 = this.translate(-1 * ic.cx, -1 * ic.cy);
		const polar = p1.getPolar();
		const p2 = this.setPolar(polar[0], polar[1] * ir);
		return p2.translate(ic.cx, ic.cy);
	}
	// point comparison
	isEqual(ic: Point): boolean {
		const rb = roundZero(this.cx - ic.cx) === 0 && roundZero(this.cy - ic.cy) === 0;
		return rb;
	}
	// measurement
	distanceToPoint(p2: Point): number {
		const rd = Math.sqrt((p2.cx - this.cx) ** 2 + (p2.cy - this.cy) ** 2);
		return rd;
	}
	angleToPoint(p2: Point): number {
		if (roundZero(this.distanceToPoint(p2)) === 0) {
			throw `err434: no angle because points identical ${this.cx} ${p2.cx} ${this.cy} ${p2.cy}`;
		}
		const ra = Math.atan2(p2.cy - this.cy, p2.cx - this.cx);
		return ra;
	}
	angleFromToPoints(p2: Point, p3: Point): number {
		const ap2 = this.angleToPoint(p2);
		const ap3 = this.angleToPoint(p3);
		const ra = withinPiPi(ap3 - ap2);
		return ra;
	}
	// from 2 points create a new point
	middlePoint(p2: Point): Point {
		const rx = (this.cx + p2.cx) / 2;
		const ry = (this.cy + p2.cy) / 2;
		return new Point(rx, ry);
	}
	equidistantPoint(p2: Point, dist: number, p3: Point): Point {
		const lp1p2h = this.distanceToPoint(p2) / 2;
		if (this.isEqual(p2)) {
			throw `err633: no equidistance because identical point ${this.cx} ${this.cy}`;
		}
		if (dist < lp1p2h) {
			throw `err392: equidistance ${dist} smaller than lp1p2h ${lp1p2h}`;
		}
		const pbi = this.middlePoint(p2);
		const abi = this.angleToPoint(p2) + Math.PI / 2;
		const oppos = Math.sqrt(dist ** 2 - lp1p2h ** 2);
		const rp1 = pbi.translatePolar(abi, oppos);
		const rp2 = pbi.translatePolar(abi + Math.PI, oppos);
		const dp1 = p3.distanceToPoint(rp1);
		const dp2 = p3.distanceToPoint(rp2);
		if (oppos !== 0 && dp1 === dp2) {
			throw `err284: magnet point p3 is on line p1p2. cx ${p3.cx} cy: ${p3.cy}`;
		}
		let rp = rp1;
		if (dp2 < dp1) {
			rp = rp2;
		}
		return rp;
	}
}

function point(ix: number, iy: number) {
	return new Point(ix, iy);
}

/* export */

export type { tPolar };
export { Point, point };
