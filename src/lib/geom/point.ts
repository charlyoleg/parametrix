// point.ts
// point.ts deals with points
// point.ts depends on geom_utils.ts

import type { tCanvasAdjust } from '$lib/geom/canvas_utils';
import type { tPolar } from '$lib/geom/geom_utils';
//import { colorCanvasPoint } from '$lib/style/colors.scss';
import { colors, point2canvas } from '$lib/geom/canvas_utils';
//import { degToRad, radToDeg, roundZero } from '$lib/geom/geom_utils';

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
		const radius = ctx.canvas.width * (0.7 / 100);
		const [cx2, cy2] = point2canvas(this.cx, this.cy, cAdjust);
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

export { Point, point };
