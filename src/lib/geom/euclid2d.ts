// euclid2d.ts
// a minimalistic 2D euclid geometry calculation library
// euclid2d.ts deals with points, lines, vectors
// euclid2d.ts depends only on the built-in library Math

import type { tCanvasAdjust } from '$lib/geom/canvas_utils';
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
	cx: number;
	cy: number;
	constructor(ix: number, iy: number) {
		this.cx = ix;
		this.cy = iy;
	}
	draw(
		ctx: CanvasRenderingContext2D,
		cAdjust: tCanvasAdjust,
		color: string = colorCanvasPoint,
		shape = 'circle'
	) {
		const radius = ctx.canvas.width * (0.7 / 100);
		const cx2 = cAdjust.shiftX + (this.cx - cAdjust.xMin) * cAdjust.scaleX;
		const cy2 = cAdjust.shiftY + (this.cy - cAdjust.yMin) * cAdjust.scaleY;
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

class EntityList {
	pointList: Array<Point>;
	xMin: number;
	xMax: number;
	yMin: number;
	yMax: number;
	constructor() {
		this.pointList = [];
		this.xMin = 0;
		this.xMax = 0;
		this.yMin = 0;
		this.yMax = 0;
	}
	addPoint(ipoint: Point) {
		this.pointList.push(ipoint);
	}
	clear() {
		this.pointList = [];
	}
	getMinMax() {
		if (this.pointList.length > 0) {
			this.xMin = this.pointList[0].cx;
			this.xMax = this.pointList[0].cx;
			this.yMin = this.pointList[0].cy;
			this.yMax = this.pointList[0].cy;
			for (const p of this.pointList) {
				this.xMin = Math.min(this.xMin, p.cx);
				this.xMax = Math.max(this.xMax, p.cx);
				this.yMin = Math.min(this.yMin, p.cy);
				this.yMax = Math.max(this.yMax, p.cy);
			}
		}
		//console.log(`dbg137: ${this.xMin}, ${this.xMax}, ${this.yMin}, ${this.yMax}`);
	}
	getAdjustFull(iCanvasWidth: number, iCanvasHeight: number): tCanvasAdjust {
		//console.log(`dbg140: ${iCanvasWidth}, ${iCanvasHeight}`);
		const rCanvasAdjust: tCanvasAdjust = {
			init: 0,
			xMin: 0,
			yMin: 0,
			xyDiff: 1,
			shiftX: 0,
			shiftY: 0,
			scaleX: 1,
			scaleY: 1
		};
		if (this.pointList.length > 0) {
			this.getMinMax();
			const xDiff = Math.max(this.xMax - this.xMin, 1);
			const yDiff = Math.max(this.yMax - this.yMin, 1);
			const xyScale = 0.9 * Math.min(iCanvasWidth / xDiff, iCanvasHeight / yDiff);
			rCanvasAdjust.init = 1;
			rCanvasAdjust.xMin = this.xMin;
			rCanvasAdjust.yMin = this.yMin;
			rCanvasAdjust.xyDiff = Math.max(xDiff, yDiff);
			rCanvasAdjust.shiftX = 0.05 * iCanvasWidth;
			rCanvasAdjust.scaleX = xyScale;
			rCanvasAdjust.shiftY = iCanvasHeight - 0.05 * iCanvasHeight;
			rCanvasAdjust.scaleY = -1 * xyScale;
		}
		//console.log(`dbg150: ${rCanvasAdjust.shiftX}, ${rCanvasAdjust.scaleX}`);
		return rCanvasAdjust;
	}
	getAdjustZoom(iCanvasWidth: number, iCanvasHeight: number): tCanvasAdjust {
		//console.log(`dbg140: ${iCanvasWidth}, ${iCanvasHeight}`);
		const rCanvasAdjust: tCanvasAdjust = {
			init: 0,
			xMin: 0,
			yMin: 0,
			xyDiff: 1,
			shiftX: 0,
			shiftY: 0,
			scaleX: 1,
			scaleY: 1
		};
		if (this.pointList.length > 0) {
			this.getMinMax();
			const xDiff = Math.max(this.xMax - this.xMin, 1);
			const yDiff = Math.max(this.yMax - this.yMin, 1);
			const xyScale = 0.9 * Math.min(iCanvasWidth / xDiff, iCanvasHeight / yDiff);
			rCanvasAdjust.init = 1;
			rCanvasAdjust.xMin = (this.xMin + this.xMax) / 2;
			rCanvasAdjust.yMin = (this.yMin + this.yMax) / 2;
			rCanvasAdjust.xyDiff = Math.max(xDiff, yDiff);
			rCanvasAdjust.shiftX = 0.05 * iCanvasWidth;
			rCanvasAdjust.scaleX = 2 * xyScale;
			rCanvasAdjust.shiftY = iCanvasHeight - 0.05 * iCanvasHeight;
			rCanvasAdjust.scaleY = -2 * xyScale;
		}
		//console.log(`dbg150: ${rCanvasAdjust.shiftX}, ${rCanvasAdjust.scaleX}`);
		return rCanvasAdjust;
	}
	draw(ctx: CanvasRenderingContext2D, adjust: tCanvasAdjust) {
		for (const p of this.pointList) {
			p.draw(ctx, adjust);
		}
	}
}

function entityList() {
	return new EntityList();
}

/* export */

export { degToRad, radToDeg, roundZero, Point, point, entityList };
