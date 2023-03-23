// euclid2d.ts
// a minimalistic 2D euclid geometry calculation library
// euclid2d.ts deals with points, lines, vectors
// euclid2d.ts depends only on the built-in library Math

import type { CanvasAdjust } from '$lib/geom/canvas_utils';
//import { colorCanvasPoint } from '$lib/style/colors.scss';
import { colorCanvasPoint } from '$lib/geom/canvas_utils';

/* utils for angles */

function degToRad(degrees: number): number {
	return degrees * (Math.PI / 180);
}

function radToDeg(rad: number): number {
	return rad / (Math.PI / 180);
}

function roundZero(ix: number): number {
	let rx = ix;
	if (Math.abs(rx) < 10 ** -4) {
		rx = 0;
	}
	return rx;
}

type tPolar = [number, number]; // angle, distance

/* Base classes */

class Point {
	cx;
	cy;
	constructor(ix: number, iy: number) {
		this.cx = ix;
		this.cy = iy;
	}
	draw(ctx: CanvasRenderingContext2D, cAdjust: CanvasAdjust, color: string = colorCanvasPoint) {
		const radius = ctx.canvas.width * (0.7 / 100);
		const cx2 = cAdjust.oX + this.cx * cAdjust.scaleX;
		const cy2 = cAdjust.oY - this.cy * cAdjust.scaleY;
		ctx.beginPath();
		ctx.arc(cx2, cy2, radius, 0, 2 * Math.PI);
		ctx.strokeStyle = color;
		ctx.stroke();
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

function point(ix: number, iy: number) {
	return new Point(ix, iy);
}

/* export */

export { degToRad, radToDeg, roundZero, point };
