// contour.ts
// contour.ts deals with open and closed path composed of segments and arcs
// contour.ts depends on point.ts, line.ts and vector.ts
// contour.ts is used by figure.ts

import type { tCanvasAdjust } from './canvas_utils';
//import type { tPolar } from './point';
//import { colorCanvasPoint } from '$lib/style/colors.scss';
import { colors, point2canvas, radius2canvas } from './canvas_utils';
import {
	//degToRad,
	//radToDeg,
	roundZero,
	//withinZero2Pi,
	withinPiPi
	//withinZeroPi,
	//withinHPiHPi
} from './angle_utils';
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
import { line, bisector, circleCenter } from './line';
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
	abstract check(): void;
}

/* Contour class */

class Contour extends AContour {
	segments: Array<Segment>;
	points: Array<Point>;
	debugPoints: Array<Point>;
	constructor(ix: number, iy: number) {
		super();
		this.segments = [new Segment(SegEnum.eStart, ix, iy, 0)];
		this.points = [];
		this.debugPoints = [];
	}
	addPointA(ax: number, ay: number): Contour {
		if (this.points.length > 2) {
			throw `err311: contour add too much point ${ax} ${ay}`;
		}
		this.points.push(point(ax, ay));
		return this;
	}
	addPointAP(aa: number, al: number): Contour {
		const p1 = point(0, 0).translatePolar(aa, al);
		this.addPointA(p1.cx, p1.cy);
		return this;
	}
	addPointR(rx: number, ry: number): Contour {
		const seg = this.segments.at(-1);
		if (seg !== undefined) {
			const p1 = point(seg.px, seg.py).translate(rx, ry);
			this.addPointA(p1.cx, p1.cy);
		} else {
			throw `err921: addPointR last segement undefined ${rx}, ${ry}`;
		}
		return this;
	}
	addPointRP(ra: number, rl: number): Contour {
		const seg = this.segments.at(-1);
		if (seg !== undefined) {
			const p1 = point(seg.px, seg.py).translatePolar(ra, rl);
			this.addPointA(p1.cx, p1.cy);
		} else {
			throw `err423: addPointRP last segement undefined ${ra}, ${rl}`;
		}
		return this;
	}
	addSeg(iSeg: Segment): Contour {
		this.segments.push(iSeg);
		return this;
	}
	addSegStroke(): Contour {
		if (this.points.length !== 1) {
			throw `err554: contour addSegStroke with unexpected points.length ${this.points.length}`;
		}
		const p1 = this.points.pop();
		if (p1 !== undefined) {
			const seg = new Segment(SegEnum.eStroke, p1.cx, p1.cy, 0);
			this.addSeg(seg);
		} else {
			throw `err284: contour p1 is undefined`;
		}
		return this;
	}
	addSegStrokeA(ax: number, ay: number): Contour {
		this.addPointA(ax, ay).addSegStroke();
		return this;
	}
	addSegStrokeAP(aa: number, al: number): Contour {
		this.addPointAP(aa, al).addSegStroke();
		return this;
	}
	addSegStrokeR(rx: number, ry: number): Contour {
		this.addPointR(rx, ry).addSegStroke();
		return this;
	}
	addSegStrokeRP(ra: number, rl: number): Contour {
		this.addPointRP(ra, rl).addSegStroke();
		return this;
	}
	addSegArc(iRadius: number, iLarge: boolean, iCcw: boolean): Contour {
		if (this.points.length !== 1) {
			throw `err954: contour addSegArc with unexpected points.length ${this.points.length}`;
		}
		const p1 = this.points.pop();
		if (p1 !== undefined) {
			const seg = new Segment(SegEnum.eArc, p1.cx, p1.cy, iRadius, iLarge, iCcw);
			this.addSeg(seg);
			//this.debugPoints.push(p1);
		} else {
			throw `err482: contour p1 is undefined`;
		}
		return this;
	}
	addSegArc2() {
		if (this.points.length !== 2) {
			throw `err958: contour addSegArc2 with unexpected points.length ${this.points.length}`;
		}
		const p2 = this.points.pop();
		const p1 = this.points.pop();
		const seg = this.segments.at(-1);
		if (p1 !== undefined && p2 !== undefined && seg !== undefined) {
			const p0 = point(seg.px, seg.py);
			const p3 = circleCenter(p0, p1, p2);
			const radius = p3.distanceToPoint(p0);
			const p0p2middle = p0.middlePoint(p2);
			const a0 = p0p2middle.angleToPoint(p0);
			const a1 = p0p2middle.angleToPoint(p1);
			const a3 = p0p2middle.angleToPoint(p3);
			const a01 = withinPiPi(a1 - a0);
			const a03 = withinPiPi(a3 - a0);
			let large = false;
			let ccw = false;
			if (Math.sign(a03) * Math.sign(a01) > 0) {
				large = true;
			}
			if (Math.sign(a01) > 0) {
				ccw = true;
			}
			//console.log(`dbg437: ${radius.toFixed(2)} ${large} ${ccw}`);
			this.addPointA(p2.cx, p2.cy).addSegArc(radius, large, ccw);
			this.debugPoints.push(p1);
			//this.debugPoints.push(p2);
		} else {
			throw `err488: contour p1 or p2 or seg is undefined`;
		}
		return this;
	}
	addSegArc3(iTangentAngle1: number, firstNlast: boolean) {
		if (this.points.length !== 1) {
			throw `err914: contour addSegArc3 with unexpected points.length ${this.points.length}`;
		}
		const p1 = this.points.pop();
		const seg = this.segments.at(-1);
		if (p1 !== undefined && seg !== undefined) {
			const p0 = point(seg.px, seg.py);
			const lbi = bisector(p0, p1);
			let pref = p1;
			if (firstNlast) {
				pref = p0;
			}
			const lradial = line(pref.cx, pref.cy, iTangentAngle1 + Math.PI / 2);
			const pArcCenter = lbi.intersection(lradial);
			const radius = pArcCenter.distanceToPoint(p0);
			const pmid = p0.middlePoint(p1);
			const amid = pref.angleToPoint(pmid);
			const aref = withinPiPi(iTangentAngle1 - amid);
			let large = false;
			if (Math.abs(aref) > Math.PI / 2) {
				large = true;
			}
			let ccw = false;
			if (aref < 0) {
				ccw = true;
			}
			if (!firstNlast) {
				ccw = !ccw;
			}
			this.addPointA(p1.cx, p1.cy).addSegArc(radius, large, ccw);
			this.debugPoints.push(pmid);
			this.debugPoints.push(pArcCenter);
		} else {
			throw `err282: contour p1 is undefined`;
		}
		return this;
	}
	addSeg2Arcs(ita1: number, ita2: number) {
		if (this.points.length !== 1) {
			throw `err214: contour addSeg2Arcs with unexpected points.length ${this.points.length}`;
		}
		const p1 = this.points.pop();
		const seg = this.segments.at(-1);
		if (p1 !== undefined && seg !== undefined) {
			const p0 = point(seg.px, seg.py);
			const l01 = p0.distanceToPoint(p1);
			const a01 = p0.angleToPoint(p1);
			const a10 = p1.angleToPoint(p0);
			const au = withinPiPi(ita1 - a01);
			const av = -1 * withinPiPi(ita2 - a10);
			//console.log(`dbg998: addSeg2Arcs au ${au} av ${av}`);
			if (Math.abs(au) >= Math.PI / 2) {
				throw `err545: addSeg2Arcs with too large au ${au}`;
			}
			if (Math.abs(av) >= Math.PI / 2) {
				throw `err546: addSeg2Arcs with too large av ${av}`;
			}
			if (roundZero(au) === 0) {
				throw `err765: addSeg2Arcs with almost zero au ${au}`;
			}
			if (roundZero(av) === 0) {
				throw `err766: addSeg2Arcs with almost zero av ${av}`;
			}
			if (Math.sign(au) * Math.sign(av) < 1) {
				throw `err767: addSeg2Arcs with au/av bad orientation ${au} ${av}`;
			}
			// l01=BH+HC
			// HG=BH*tan(au/2)=HC*tan(av/2)
			// l01=HG*(1/tan(au/2)+1/tan(av/2))
			// l01*tan(au/2)*tan(av/2)=HG*tan(av/2)+HG*tan(au/2)
			// HG=l01*tan(au/2)*tan(av/2)/(tan(av/2)+tan(au/2))
			// trigonometry half-angle formula: tan(a/2)=(1-cos(a))/sin(a)
			// trigonometry tan(a+b)=(tan(a)+tan(b))/(1-tan(a)*tan(b))
			const tanu2 = Math.tan(au / 2);
			const tanv2 = Math.tan(av / 2);
			//const lHG = (l01 * tanu2 * tanv2) / (tanv2 + tanu2); // only for console.log()
			//const lBH = lHG/tanu2;
			const lBH = (l01 * tanv2) / (tanv2 + tanu2);
			// cos(PI/2-au)=sin(u)=lBH/lJB
			// lJB=lBH/sin(au)
			const lJB = lBH / Math.sin(au);
			//const lJH = lBH / Math.cotan(au);
			const lBG = lBH / Math.cos(au / 2);
			const lHC = (l01 * tanu2) / (tanv2 + tanu2);
			const lIC = lHC / Math.sin(av);
			//const lCG = lHC / Math.cos(av / 2); // only for console.log()
			const p2 = p0.translatePolar(a01 + au / 2, lBG);
			let ccw = false;
			if (Math.sign(au) < 0) {
				ccw = true;
			}
			//console.log(`dbg401: addSeg2Arcs l01 ${l01} lHG ${lHG}`);
			//console.log(`dbg409: addSeg2Arcs lBH ${lBH} lBG ${lBG} lJB ${lJB}`);
			//console.log(`dbg408: addSeg2Arcs lHC ${lHC} lCG ${lCG} lIC ${lIC}`);
			this.addPointA(p2.cx, p2.cy).addSegArc(lJB, false, ccw);
			this.addPointA(p1.cx, p1.cy).addSegArc(lIC, false, ccw);
			//this.debugPoints.push(p2);
			this.debugPoints.push(p0.translatePolar(a01, lBH)); // H
			this.debugPoints.push(p0.translatePolar(a01 + au - Math.PI / 2, lJB)); // J
			//this.debugPoints.push(p1.translatePolar(a10, lHC)); // H
			this.debugPoints.push(p1.translatePolar(a10 - av + Math.PI / 2, lIC)); // I
		} else {
			throw `err182: contour p1 is undefined`;
		}
		return this;
	}
	addCornerPointed(): Contour {
		const seg = new Segment(SegEnum.ePointed, 0, 0, 0);
		this.addSeg(seg);
		return this;
	}
	addCornerRounded(iRadius: number): Contour {
		const seg = new Segment(SegEnum.eRounded, 0, 0, iRadius);
		this.addSeg(seg);
		return this;
	}
	addCornerWidened(iRadius: number): Contour {
		const seg = new Segment(SegEnum.eWidened, 0, 0, iRadius);
		this.addSeg(seg);
		return this;
	}
	closeSegStroke(): Contour {
		const px = this.segments[0].px;
		const py = this.segments[0].py;
		this.addSegStrokeA(px, py);
		return this;
	}
	closeSegArc(iRadius: number, iLarge: boolean, iCcw: boolean): Contour {
		const px = this.segments[0].px;
		const py = this.segments[0].py;
		this.addPointA(px, py).addSegArc(iRadius, iLarge, iCcw);
		return this;
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
				try {
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
					const cRadius = radius2canvas(seg.radius, cAdjust);
					ctx.beginPath();
					ctx.arc(cx3, cy3, cRadius, -a1, -a2, seg.arcCcw);
					ctx.strokeStyle = color;
					ctx.stroke();
				} catch (emsg) {
					console.log('err413: ' + emsg);
				}
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
				rContour.addSeg(seg);
			}
		}
		return rContour;
	}
	generateContour(): Contour {
		const rContour = this.extractSkeleton(); // TODO
		return rContour;
	}
	generatePoints(): Array<Point> {
		const rPoints = [];
		rPoints.push(...this.debugPoints);
		const seg0 = this.segments[0];
		rPoints.push(point(seg0.px, seg0.py));
		let px1 = 0;
		let py1 = 0;
		for (const seg of this.segments) {
			if (seg.sType === SegEnum.eArc) {
				try {
					const [px3, py3, a1, a2] = toCanvasArc(
						px1,
						py1,
						seg.px,
						seg.py,
						seg.radius,
						seg.arcLarge,
						seg.arcCcw
					);
					const p3 = point(px3, py3);
					const a12h = withinPiPi((a2 - a1) / 2);
					let a3 = a1 + a12h;
					if (
						(Math.sign(a12h) > 0 && !seg.arcCcw) ||
						(Math.sign(a12h) < 0 && seg.arcCcw)
					) {
						a3 += Math.PI;
					}
					const p4 = p3.translatePolar(a3, seg.radius);
					rPoints.push(p4);
				} catch (emsg) {
					console.log('err413: ' + emsg);
				}
			}
			if (
				seg.sType === SegEnum.eStroke ||
				seg.sType === SegEnum.eArc ||
				seg.sType === SegEnum.eStart
			) {
				px1 = seg.px;
				py1 = seg.py;
				rPoints.push(point(px1, py1));
			}
		}
		return rPoints;
	}
	check() {
		let px1 = 0;
		let py1 = 0;
		for (const seg of this.segments) {
			if (seg.sType === SegEnum.eArc) {
				try {
					toCanvasArc(px1, py1, seg.px, seg.py, seg.radius, seg.arcLarge, seg.arcCcw);
				} catch (emsg) {
					throw `err778: ${emsg}`;
				}
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
	check() {
		true;
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
