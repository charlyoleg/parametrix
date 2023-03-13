// euclid2d.ts
// a minimalistic 2D euclid geometry calculation library
// euclid2d.ts deals with points, lines, vectors
// euclid2d.ts depends only on the built-in library Math

import type { CanvasAdjust } from '$lib/geom/canvas_utils.js';
//import { colorCanvasPoint } from '$lib/style/colors.scss';
import { colorCanvasPoint } from '$lib/geom/canvas_utils.js';

/* utils for angles */

function degToRad(degrees: number) {
	return degrees * (Math.PI / 180);
}

function radToDeg(rad: number) {
	return rad / (Math.PI / 180);
}

/* Base classes */

class Point {
	cx;
	cy;
	constructor(ix: number, iy: number) {
		this.cx = ix;
		this.cy = iy;
	}
	draw(ctx: CanvasRenderingContext2D, cAdjust: CanvasAdjust) {
		const radius = ctx.canvas.width * (0.7 / 100);
		const cx2 = cAdjust.oX + this.cx * cAdjust.scaleX;
		const cy2 = cAdjust.oY - this.cy * cAdjust.scaleY;
		ctx.beginPath();
		ctx.arc(cx2, cy2, radius, 0, 2 * Math.PI);
		ctx.strokeStyle = colorCanvasPoint;
		ctx.stroke();
	}
}

function point(ix: number, iy: number) {
	return new Point(ix, iy);
}

/* export */

export { degToRad, radToDeg, point };
