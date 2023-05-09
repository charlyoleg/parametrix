// figure.ts
// a minimalistic 2D euclid geometry calculation library
// figure.ts deals with points, lines, vectors, contours
// figure.ts gather all other modules of geom

import type { tCanvasAdjust } from './canvas_utils';
//import { colorCanvasPoint } from '$lib/style/colors.scss';
import { colors, adjustZero, adjustInit } from './canvas_utils';
import { degToRad, radToDeg, roundZero } from './angle_utils';
import { Point, point } from './point';
import { Line, line, bisector, circleCenter } from './line';
import { Vector, vector } from './vector';
import type { tContour } from './contour';
import { Contour, ContourCircle, contour, contourCircle } from './contour';

type tLayers = {
	points: boolean;
	lines: boolean;
	vectors: boolean;
	main: boolean;
	mainB: boolean;
	second: boolean;
	secondB: boolean;
	dynamics: boolean;
	frame: boolean;
};

class Figure {
	pointList: Array<Point>;
	lineList: Array<Line>;
	vectorList: Array<Vector>;
	mainList: Array<tContour>;
	mainBList: Array<tContour>;
	secondList: Array<tContour>;
	secondBList: Array<tContour>;
	dynamicsList: Array<tContour>;
	xMin: number;
	xMax: number;
	yMin: number;
	yMax: number;
	constructor() {
		this.pointList = [];
		this.lineList = [];
		this.vectorList = [];
		this.mainList = [];
		this.mainBList = [];
		this.secondList = [];
		this.secondBList = [];
		this.dynamicsList = [];
		this.xMin = 0;
		this.xMax = 0;
		this.yMin = 0;
		this.yMax = 0;
	}
	addPoint(ipoint: Point) {
		this.pointList.push(ipoint);
	}
	addPoints(ipoints: Array<Point>) {
		for (const ipt of ipoints) {
			this.pointList.push(ipt);
		}
	}
	addLine(iline: Line) {
		this.lineList.push(iline);
	}
	addVector(ivector: Vector) {
		this.vectorList.push(ivector);
	}
	addMain(icontour: tContour) {
		this.addPoints(icontour.generatePoints());
		this.mainList.push(icontour.generateContour());
		this.mainBList.push(icontour.extractSkeleton());
	}
	addSecond(icontour: tContour) {
		this.addPoints(icontour.generatePoints());
		this.secondList.push(icontour.generateContour());
		this.secondBList.push(icontour.extractSkeleton());
	}
	addDynamics(icontour: tContour) {
		this.addPoints(icontour.generatePoints());
		this.dynamicsList.push(icontour);
	}
	clear() {
		this.pointList = [];
		this.lineList = [];
		this.vectorList = [];
		this.mainList = [];
		this.mainBList = [];
		this.secondList = [];
		this.secondBList = [];
		this.dynamicsList = [];
	}
	getMinMax() {
		if (this.pointList.length > 0) {
			// the first point of the list should not contain infinity
			const p0 = this.pointList[0];
			if (
				p0.cx === Number.NEGATIVE_INFINITY ||
				p0.cx === Number.POSITIVE_INFINITY ||
				p0.cy === Number.NEGATIVE_INFINITY ||
				p0.cy === Number.POSITIVE_INFINITY
			) {
				throw `err392: first point with infinity: ${p0.cx} ${p0.cy}`;
			}
			this.xMin = this.pointList[0].cx;
			this.xMax = this.pointList[0].cx;
			this.yMin = this.pointList[0].cy;
			this.yMax = this.pointList[0].cy;
			for (const p of this.pointList) {
				if (p.cx !== Number.NEGATIVE_INFINITY) {
					this.xMin = Math.min(this.xMin, p.cx);
				}
				if (p.cx !== Number.POSITIVE_INFINITY) {
					this.xMax = Math.max(this.xMax, p.cx);
				}
				if (p.cy !== Number.NEGATIVE_INFINITY) {
					this.yMin = Math.min(this.yMin, p.cy);
				}
				if (p.cy !== Number.POSITIVE_INFINITY) {
					this.yMax = Math.max(this.yMax, p.cy);
				}
			}
		}
		//console.log(`dbg137: ${this.xMin}, ${this.xMax}, ${this.yMin}, ${this.yMax}`);
	}
	getAdjustFull(iCanvasWidth: number, iCanvasHeight: number): tCanvasAdjust {
		//console.log(`dbg140: ${iCanvasWidth}, ${iCanvasHeight}`);
		let rCanvasAdjust: tCanvasAdjust = adjustZero();
		if (this.pointList.length > 0) {
			this.getMinMax();
			rCanvasAdjust = adjustInit(
				this.xMin,
				this.xMax,
				this.yMin,
				this.yMax,
				iCanvasWidth,
				iCanvasHeight
			);
		}
		//console.log(`dbg150: ${rCanvasAdjust.shiftX}, ${rCanvasAdjust.scaleX}`);
		return rCanvasAdjust;
	}
	getAdjustZoom(iCanvasWidth: number, iCanvasHeight: number): tCanvasAdjust {
		//console.log(`dbg140: ${iCanvasWidth}, ${iCanvasHeight}`);
		let rCanvasAdjust: tCanvasAdjust = adjustZero();
		if (this.pointList.length > 0) {
			this.getMinMax();
			const xMin = (this.xMin + this.xMax) / 2;
			const yMin = (this.yMin + this.yMax) / 2;
			rCanvasAdjust = adjustInit(
				xMin,
				this.xMax,
				yMin,
				this.yMax,
				iCanvasWidth,
				iCanvasHeight
			);
		}
		//console.log(`dbg150: ${rCanvasAdjust.shiftX}, ${rCanvasAdjust.scaleX}`);
		return rCanvasAdjust;
	}
	draw(ctx: CanvasRenderingContext2D, adjust: tCanvasAdjust, layers: tLayers) {
		if (layers.points) {
			for (const p of this.pointList) {
				p.draw(ctx, adjust);
			}
		}
		if (layers.lines) {
			for (const li of this.lineList) {
				li.draw(ctx, adjust);
			}
		}
		if (layers.vectors) {
			for (const li of this.vectorList) {
				li.draw(ctx, adjust);
			}
		}
		if (layers.main) {
			for (const li of this.mainList) {
				li.draw(ctx, adjust, colors.main);
			}
		}
		if (layers.mainB) {
			for (const li of this.mainBList) {
				li.draw(ctx, adjust, colors.mainB);
			}
		}
		if (layers.second) {
			for (const li of this.secondList) {
				li.draw(ctx, adjust, colors.second);
			}
		}
		if (layers.secondB) {
			for (const li of this.secondList) {
				li.draw(ctx, adjust, colors.secondB);
			}
		}
		if (layers.dynamics) {
			for (const li of this.dynamicsList) {
				li.draw(ctx, adjust, colors.dynamics);
			}
		}
		if (layers.frame) {
			for (const i of [10, 100, 200]) {
				point(i, 0).draw(ctx, adjust, colors.reference, 'cross');
				point(-i, 0).draw(ctx, adjust, colors.reference, 'cross');
				point(0, i).draw(ctx, adjust, colors.reference, 'cross');
				point(0, -i).draw(ctx, adjust, colors.reference, 'cross');
			}
			point(0, 0).draw(ctx, adjust, colors.origin, 'cross');
		}
	}
}

function figure() {
	return new Figure();
}

function initLayers(): tLayers {
	const layers: tLayers = {
		points: false,
		lines: false,
		vectors: false,
		main: true,
		mainB: false,
		second: true,
		secondB: false,
		dynamics: false,
		frame: false
	};
	return layers;
}

/* export */

export type { tLayers };
export {
	degToRad,
	radToDeg,
	roundZero,
	Point,
	point,
	Line,
	line,
	bisector,
	circleCenter,
	Vector,
	vector,
	Contour,
	ContourCircle,
	contour,
	contourCircle,
	Figure,
	figure,
	initLayers
};
