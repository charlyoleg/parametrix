// segment.ts
// segment.ts deals with segments and arcs for helping the module contour.ts
// segment.ts depends on point.ts, line.ts and vector.ts
// segment.ts is used by contour.ts

//import type { tCanvasAdjust } from './canvas_utils';
//import type { tPolar } from './point';
//import { colorCanvasPoint } from '$lib/style/colors.scss';
import {
	//degToRad,
	//radToDeg,
	//roundZero,
	withinZero2Pi
	//withinPiPi,
	//withinZeroPi,
	//withinHPiHPi
} from './angle_utils';
//import { colors, point2canvas, radius2canvas } from './canvas_utils';
import {
	//rightTriLaFromLbLc,
	rightTriLbFromLaLc
	//lcFromLaLbAc,
	//aCFromLaLbLc,
	//aCFromAaAb,
	//lbFromLaAaAb,
	//aBFromLaLbAa
} from './triangle_utils';
import { point } from './point';
//import { line, bisector, circleCenter } from './line';
//import { vector, Vector } from './vector';

enum SegEnum {
	eStroke,
	eArc,
	ePointed,
	eRounded,
	eWidened,
	eStart
}

function isSeg(iSegEnum: SegEnum) {
	let rIsSeg = false;
	if (iSegEnum === SegEnum.eStroke || iSegEnum === SegEnum.eArc) {
		rIsSeg = true;
	}
	return rIsSeg;
}
function isAddPoint(iSegEnum: SegEnum) {
	let rIsOther = false;
	if (isSeg(iSegEnum) || iSegEnum === SegEnum.eStart) {
		rIsOther = true;
	}
	return rIsOther;
}
function isActiveCorner(iSegEnum: SegEnum) {
	let rIsActiveCorner = false;
	if (iSegEnum === SegEnum.eRounded || iSegEnum === SegEnum.eWidened) {
		rIsActiveCorner = true;
	}
	return rIsActiveCorner;
}
function isCorner(iSegEnum: SegEnum) {
	let rIsCorner = false;
	if (iSegEnum === SegEnum.ePointed || isActiveCorner(iSegEnum)) {
		rIsCorner = true;
	}
	return rIsCorner;
}

/* Segment class */

class Segment1 {
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
class Segment2 {
	sType: SegEnum;
	p1x: number;
	p1y: number;
	p2x: number;
	p2y: number;
	pcx: number;
	pcy: number;
	radius: number;
	a1: number;
	a2: number;
	arcCcw: boolean;
	constructor(
		iType: SegEnum,
		ip1x: number,
		ip1y: number,
		ip2x: number,
		ip2y: number,
		ipcx: number,
		ipcy: number,
		iRadius: number,
		ia1: number,
		ia2: number,
		iArcCcw = false
	) {
		this.sType = iType;
		this.p1x = ip1x;
		this.p1y = ip1y;
		this.p2x = ip2x;
		this.p2y = ip2y;
		this.pcx = ipcx;
		this.pcy = ipcy;
		this.radius = iRadius;
		this.a1 = ia1;
		this.a2 = ia2;
		this.arcCcw = iArcCcw;
	}
}

function arcSeg1To2(px1: number, py1: number, iSeg1: Segment1) {
	if (iSeg1.sType !== SegEnum.eArc) {
		throw `err202: arcSeg1To2 has unexpected type ${iSeg1.sType}`;
	}
	const p1 = point(px1, py1);
	const p2 = point(iSeg1.px, iSeg1.py);
	const lp1p2h = p1.distanceToPoint(p2) / 2;
	if (p1.isEqual(p2)) {
		throw `err638: no equidistance because identical point ${p1.cx} ${p2.cy}`;
	}
	if (iSeg1.radius < lp1p2h) {
		throw `err399: radius ${iSeg1.radius} smaller than lp1p2h ${lp1p2h}`;
	}
	const pbi = p1.middlePoint(p2);
	const abi = p1.angleToPoint(p2) + Math.PI / 2;
	const oppos = rightTriLbFromLaLc(iSeg1.radius, lp1p2h);
	const rp1 = pbi.translatePolar(abi, oppos);
	const rp2 = pbi.translatePolar(abi + Math.PI, oppos);
	let rp3 = rp1;
	if ((!iSeg1.arcLarge && !iSeg1.arcCcw) || (iSeg1.arcLarge && iSeg1.arcCcw)) {
		rp3 = rp2;
	}
	const px3 = rp3.cx;
	const py3 = rp3.cy;
	const a1 = rp3.angleToPoint(p1);
	const a2 = rp3.angleToPoint(p2);
	const rSeg2 = new Segment2(
		SegEnum.eArc,
		px1,
		py1,
		iSeg1.px,
		iSeg1.py,
		px3,
		py3,
		iSeg1.radius,
		a1,
		a2,
		iSeg1.arcCcw
	);
	return rSeg2;
}
function arcSeg2To1(iSeg2: Segment2) {
	let a12 = withinZero2Pi(iSeg2.a2 - iSeg2.a1);
	if (!iSeg2.arcCcw) {
		a12 = 2 * Math.PI - a12;
	}
	let large = false;
	if (a12 > Math.PI) {
		large = true;
	}
	const rSeg1 = new Segment1(
		SegEnum.eArc,
		iSeg2.p2x,
		iSeg2.p2y,
		iSeg2.radius,
		large,
		iSeg2.arcCcw
	);
	return rSeg1;
}

function makeCorner(s1: Segment2, s2: Segment2, s3: Segment2): Array<Segment2> {
	//const p1 = point(s1.p1x, s1.p1y);
	const p2 = point(s1.p2x, s1.p2y);
	const p2b = point(s2.p1x, s2.p1y);
	//const p3 = point(s2.p2x, s2.p2y);
	//const p4 = point(s1.pcx, s1.pcy);
	//const p5 = point(s2.pcx, s2.pcy);
	if (!p2.isEqual(p2b)) {
		throw `err309: makeCorner p2 and p2b differ px ${p2.cx} ${p2b.cx} py ${p2.cy} ${p2b.cy}`;
	}
	const rsegs: Array<Segment2> = [];
	// TODO
	rsegs.push(s1);
	rsegs.push(s3);
	return rsegs;
}

export {
	SegEnum,
	isSeg,
	isAddPoint,
	isActiveCorner,
	isCorner,
	Segment1,
	Segment2,
	arcSeg1To2,
	arcSeg2To1,
	makeCorner
};
