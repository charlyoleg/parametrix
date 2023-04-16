// line.ts
// line.ts deals with lines
// line.ts depends on angle_utils.ts, triangle_utils.ts and point.ts

import type { tCanvasAdjust } from '$lib/geom/canvas_utils';
import type { tPolar } from '$lib/geom/point';
//import { colorCanvasPoint } from '$lib/style/colors.scss';
import { colors, point2canvas } from '$lib/geom/canvas_utils';
import { roundZero } from '$lib/geom/angle_utils';
import { Point, anglePoints } from '$lib/geom/point';

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
		const [cx2, cy2] = point2canvas(this.cx, this.cy, cAdjust);
		ctx.beginPath();
		ctx.moveTo(
			cx2 - display_length * Math.cos(this.ca),
			cy2 - display_length * Math.sin(this.ca)
		);
		ctx.lineTo(
			cx2 + 2 * display_length * Math.cos(this.ca),
			cy2 + 2 * display_length * Math.sin(this.ca)
		);
		ctx.strokeStyle = color;
		ctx.stroke();
	}
	setFromPoints(p1: Point, p2: Point) {
		this.cx = p1.cx;
		this.cy = p1.cy;
		this.ca = anglePoints(p1, p2);
	}
	getAxisXIntersection() {
		let rX = Infinity;
		if (roundZero(this.ca % Math.PI) !== 0) {
			const p1 = new Point(this.cx, this.cy);
			const a31 = p1.angleOrig();
			const s1 = p1.distanceOrig();
			const a23 = Math.PI - this.ca;
			const a12 = Math.PI - a31 - a23;
			rX = (s1 * Math.sin(a12)) / Math.sin(a23);
		}
		return rX;
	}
	getAxisYIntersection() {
		let rY = Infinity;
		if (roundZero((this.ca - Math.PI / 2) % Math.PI) !== 0) {
			const p1 = new Point(this.cx, this.cy);
			const a31 = p1.angleOrig();
			const s1 = p1.distanceOrig();
			const a23 = Math.PI / 2 + this.ca;
			const a12 = Math.PI - a31 - a23;
			rY = (s1 * Math.sin(a12)) / Math.sin(a23);
		}
		return rY;
	}
	distanceOrig(): number {
		const a23 = Math.PI - this.ca;
		let rd = Infinity;
		if (Math.abs(roundZero(this.ca % (Math.PI / 2))) > Math.PI / 4) {
			const lx = this.getAxisXIntersection();
			rd = lx * Math.sin(a23);
		} else {
			const ly = this.getAxisYIntersection();
			rd = ly * Math.sin(Math.PI / 2 + a23);
		}
		return rd;
	}
	angleOrig(): number {
		const ra = Math.PI / 2 + this.ca;
		return ra;
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
}

function line(ix: number, iy: number, ia: number) {
	return new Line(ix, iy, ia);
}

/* export */

export { Line, line };
