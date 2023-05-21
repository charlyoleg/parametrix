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
	withinZero2Pi,
	withinPiPi
	//withinZeroPi,
	//withinHPiHPi
} from './angle_utils';
//import { colors, point2canvas, radius2canvas } from './canvas_utils';
import {
	//rightTriLaFromLbLc,
	rightTriLbFromLaLc,
	//lcFromLaLbAc,
	aCFromLaLbLc,
	//aCFromAaAb,
	//lbFromLaAaAb,
	aBFromLaLbAa
} from './triangle_utils';
import { point, Point } from './point';
//import { line, bisector, circleCenter } from './line';
import { line } from './line';
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
	p1: Point;
	p2: Point;
	pc: Point;
	radius: number;
	a1: number;
	a2: number;
	arcCcw: boolean;
	constructor(
		iType: SegEnum,
		ip1: Point,
		ip2: Point,
		ipc: Point,
		iRadius: number,
		ia1: number,
		ia2: number,
		iArcCcw = false
	) {
		this.sType = iType;
		this.p1 = ip1;
		this.p2 = ip2;
		this.pc = ipc;
		this.radius = iRadius;
		this.a1 = ia1;
		this.a2 = ia2;
		this.arcCcw = iArcCcw;
	}
}

function arcSeg1To2(px1: number, py1: number, iSeg1: Segment1): Segment2 {
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
		//console.log(`dbg398: ${p1.cx} ${p1.cy} ${iSeg1.px} ${iSeg1.py}`);
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
	const a1 = rp3.angleToPoint(p1);
	const a2 = rp3.angleToPoint(p2);
	const rSeg2 = new Segment2(SegEnum.eArc, p1, p2, rp3, iSeg1.radius, a1, a2, iSeg1.arcCcw);
	return rSeg2;
}
function arcSeg2To1(iSeg2: Segment2): Segment1 {
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
		iSeg2.p2.cx,
		iSeg2.p2.cy,
		iSeg2.radius,
		large,
		iSeg2.arcCcw
	);
	return rSeg1;
}

type tPrepare = {
	s1: Segment2;
	s2: Segment2;
	s3: Segment2;
	ra: number;
	p1: Point;
	p2: Point;
	p3: Point;
	p4: Point;
	p5: Point;
	p6: Point;
	at1: number;
	at3: number;
	abi: number;
	aph: number;
};
function prepare(s1: Segment2, s2: Segment2, s3: Segment2): tPrepare {
	const p1 = s1.p1;
	const p2 = s1.p2;
	const p2b = s3.p1;
	const p3 = s3.p2;
	if (!p2.isEqual(p2b)) {
		throw `err309: makeCorner-prepare p2 and p2b differ px ${p2.cx} ${p2b.cx} py ${p2.cy} ${p2b.cy}`;
	}
	let aTangent1 = p2.angleToPoint(p1);
	if (s1.sType === SegEnum.eArc) {
		const sign = s1.arcCcw ? 1 : -1;
		aTangent1 = s1.a2 - (sign * Math.PI) / 2;
	}
	let aTangent3 = p2.angleToPoint(p3);
	if (s3.sType === SegEnum.eArc) {
		const sign = s3.arcCcw ? 1 : -1;
		aTangent3 = s3.a1 + (sign * Math.PI) / 2;
	}
	const a123 = aTangent3 - aTangent1;
	const a123b = withinPiPi(a123); // the sign might change
	const aPeakHalf = a123b / 2;
	const aBisector = aTangent1 + aPeakHalf;
	const p6 = p2.translatePolar(aBisector, s2.radius);
	const rPre: tPrepare = {
		s1: s1,
		s2: s2,
		s3: s3,
		ra: s2.radius,
		p1: p1,
		p2: p2,
		p3: p3,
		p4: s1.pc,
		p5: s3.pc,
		p6: p6,
		at1: aTangent1,
		at3: aTangent3,
		abi: aBisector,
		aph: aPeakHalf
	};
	return rPre;
}
function modifRadius(iaph: number, iseg: Segment2, iradius: number): number {
	if (iseg.sType !== SegEnum.eArc) {
		throw `err510: modifRadius with wrong type ${iseg.sType}`;
	}
	const bisector = iaph > 0 ? 1 : -1;
	const arcCcw = iseg.arcCcw ? 1 : -1;
	const rmr = iseg.radius + bisector * arcCcw * iradius;
	if (rmr <= 0) {
		throw `err621: modifRadius with negative modified lenght ${rmr}`;
	}
	return rmr;
}
function roundStrokeStroke(ag: tPrepare): Array<Segment2> {
	const l7 = Math.abs(ag.ra / Math.sin(ag.aph));
	const l7b = l7 * Math.cos(ag.aph);
	const l21 = ag.p2.distanceToPoint(ag.p1);
	const l23 = ag.p2.distanceToPoint(ag.p3);
	if (l7b > l21 || l7b > l23) {
		throw `err227: roundStrokeStroke too short stroke ${l7b} ${l21} ${l23}`;
	}
	const p7 = ag.p2.translatePolar(ag.abi, l7);
	const a7b = Math.sign(ag.aph) * (Math.PI / 2 - Math.abs(ag.aph));
	const a72 = ag.abi + Math.PI;
	const a78 = a72 + a7b;
	const a79 = a72 - a7b;
	const p8 = line(0, 0, 0).setFromPoints(ag.p1, ag.p2).projectPoint(p7);
	const p9 = line(0, 0, 0).setFromPoints(ag.p2, ag.p3).projectPoint(p7);
	//const p8 = p7.translatePolar(a78, ag.ra);
	//const p9 = p7.translatePolar(a79, ag.ra);
	//const p8 = ag.p2.translatePolar(ag.at1, l7b);
	//const p9 = ag.p2.translatePolar(ag.at3, l7b);
	const ccw2 = ag.aph > 0 ? false : true;
	const rsegs: Array<Segment2> = [];
	const p0 = point(0, 0);
	const p1 = ag.p1.clone();
	const p3 = ag.p3.clone();
	rsegs.push(new Segment2(SegEnum.eStroke, p1, p8, p0, 0, 0, 0, false));
	rsegs.push(new Segment2(SegEnum.eArc, p8, p9, p7, ag.ra, a78, a79, ccw2));
	rsegs.push(new Segment2(SegEnum.eStroke, p9, p3, p0, 0, 0, 0, false));
	return rsegs;
}
function roundStrokeArc(ag: tPrepare): Array<Segment2> {
	if (ag.s1.sType !== SegEnum.eArc && ag.s3.sType !== SegEnum.eArc) {
		throw `err209: roundStrokeArc unexpected sType ${ag.s1.sType} ${ag.s3.sType}`;
	}
	let p1p3 = ag.p3;
	let pArcC = ag.p4;
	let sarc = ag.s1;
	let arcFirst = -1;
	if (ag.s1.sType === SegEnum.eStroke) {
		p1p3 = ag.p1;
		pArcC = ag.p5;
		sarc = ag.s3;
		arcFirst = 1;
	}
	const lStroke = line(0, 0, 0).setFromPoints(p1p3, ag.p2);
	const lStrokep = lStroke.lineParallelDistance(ag.ra, ag.p6);
	const lRadial = line(0, 0, 0).setFromPoints(ag.p2, pArcC);
	const pA = lStrokep.intersection(lRadial);
	const lA4 = pA.distanceToPoint(pArcC);
	const aA = pA.angleFromToPoints(p1p3, pArcC);
	const ml = modifRadius(ag.aph, sarc, ag.ra);
	const sin7 = (lA4 * Math.sin(aA)) / ml; // law of sinus
	const a7 = Math.asin(sin7);
	const a4 = Math.PI - Math.abs(aA) - Math.abs(a7);
	const sign4 = sarc.arcCcw ? 1 : -1;
	const a47 = pArcC.angleToPoint(ag.p2) + arcFirst * sign4 * a4;
	const p7 = pArcC.translatePolar(a47, ml);
	const pArcT = pArcC.translatePolar(a47, sarc.radius);
	const a127 = ag.p2.angleFromToPoints(p1p3, p7);
	const l27 = Math.abs(ag.ra / Math.sin(a127));
	const lStrokeT = l27 * Math.cos(a127);
	const aStrokeT = ag.p2.angleToPoint(p1p3);
	const pStrokeT = ag.p2.translatePolar(aStrokeT, lStrokeT);
	let p8 = pArcT;
	let p9 = pStrokeT;
	if (ag.s1.sType === SegEnum.eStroke) {
		p8 = pStrokeT;
		p9 = pArcT;
	}
	const a78 = p7.angleToPoint(p8);
	const a79 = p7.angleToPoint(p9);
	const am = a47; //pArcC.angleToPoint(pArcT);
	const ccw2 = ag.aph > 0 ? false : true;
	const rsegs: Array<Segment2> = [];
	const p0 = point(0, 0);
	const p1 = ag.p1.clone();
	const p3 = ag.p3.clone();
	const pc = sarc.pc.clone();
	if (ag.s1.sType === SegEnum.eStroke) {
		rsegs.push(new Segment2(SegEnum.eStroke, p1, p8, p0, 0, 0, 0, false));
		rsegs.push(new Segment2(SegEnum.eArc, p8, p9, p7, ag.ra, a78, a79, ccw2));
		rsegs.push(new Segment2(SegEnum.eArc, p9, p3, pc, sarc.radius, am, sarc.a2, sarc.arcCcw));
	} else {
		rsegs.push(new Segment2(SegEnum.eArc, p1, p8, pc, sarc.radius, sarc.a1, am, sarc.arcCcw));
		rsegs.push(new Segment2(SegEnum.eArc, p8, p9, p7, ag.ra, a78, a79, ccw2));
		rsegs.push(new Segment2(SegEnum.eStroke, p9, p3, p0, 0, 0, 0, false));
	}
	//console.log('dbg535');
	//console.log(pc);
	//console.log(p7);
	//console.log(p1);
	//console.log(p8);
	//console.log(p9);
	//console.log(p3);
	return rsegs;
}
function roundArcArc(ag: tPrepare): Array<Segment2> {
	const mr1 = modifRadius(ag.aph, ag.s1, ag.ra);
	const mr3 = modifRadius(ag.aph, ag.s3, ag.ra);
	const lp4p5 = ag.p4.distanceToPoint(ag.p5);
	const a45 = ag.p4.angleToPoint(ag.p5);
	const a547 = aCFromLaLbLc(lp4p5, mr1, mr3);
	const sign1 = 1;
	const a47 = a45 + sign1 * a547;
	const p7 = ag.p4.translatePolar(a47, mr1);
	const p8 = ag.p4.translatePolar(a47, ag.s1.radius);
	const a54 = Math.PI + a45;
	//const a457 = aCFromLaLbLc(lp4p5, mr3, mr1);
	const a457 = aBFromLaLbAa(mr3, mr1, a547);
	const sign2 = -1;
	const a57 = a54 + sign2 * a457;
	const p7b = ag.p5.translatePolar(a57, mr3);
	if (!p7b.isEqual(p7)) {
		throw `err909: roundArcArc p7 anf p7b differ ${p7.cx} ${p7b.cx} ${p7.cy} ${p7b.cy}`;
	}
	const p9 = ag.p5.translatePolar(a57, ag.s3.radius);
	const a48 = ag.p4.angleToPoint(p8);
	const a78 = p7.angleToPoint(p8);
	const a79 = p7.angleToPoint(p9);
	const a59 = ag.p5.angleToPoint(p9);
	const ccw2 = ag.aph > 0 ? false : true;
	const p1 = ag.p1.clone();
	const p3 = ag.p3.clone();
	const p4 = ag.p4.clone();
	const p5 = ag.p5.clone();
	const rsegs: Array<Segment2> = [];
	rsegs.push(new Segment2(SegEnum.eArc, p1, p8, p4, ag.s1.radius, ag.s1.a1, a48, ag.s1.arcCcw));
	rsegs.push(new Segment2(SegEnum.eArc, p8, p9, p7, ag.ra, a78, a79, ccw2));
	rsegs.push(new Segment2(SegEnum.eArc, p9, p3, p5, ag.s3.radius, a59, ag.s3.a2, ag.s3.arcCcw));
	return rsegs;
}
function widenStrokeStroke(ag: tPrepare): Array<Segment2> {
	// TODO
	const rsegs: Array<Segment2> = [];
	rsegs.push(ag.s1);
	rsegs.push(ag.s3);
	return rsegs;
}
function widenStrokeArc(ag: tPrepare): Array<Segment2> {
	// TODO
	const rsegs: Array<Segment2> = [];
	rsegs.push(ag.s1);
	rsegs.push(ag.s3);
	return rsegs;
}
function widenArcArc(ag: tPrepare): Array<Segment2> {
	// TODO
	const rsegs: Array<Segment2> = [];
	rsegs.push(ag.s1);
	rsegs.push(ag.s3);
	return rsegs;
}
function makeCorner(s1: Segment2, s2: Segment2, s3: Segment2): Array<Segment2> {
	const preArg = prepare(s1, s2, s3);
	const rsegs: Array<Segment2> = [];
	if (s2.sType === SegEnum.eRounded) {
		if (s1.sType === SegEnum.eStroke && s3.sType === SegEnum.eStroke) {
			rsegs.push(...roundStrokeStroke(preArg));
		} else if (s1.sType === SegEnum.eStroke || s3.sType === SegEnum.eStroke) {
			rsegs.push(...roundStrokeArc(preArg));
		} else if (s1.sType === SegEnum.eArc && s3.sType === SegEnum.eArc) {
			rsegs.push(...roundArcArc(preArg));
		} else {
			throw `err123: makeCorner unexpected s1s3.sType ${s1.sType} ${s3.sType}`;
		}
	} else if (s2.sType === SegEnum.eWidened) {
		if (s1.sType === SegEnum.eStroke && s3.sType === SegEnum.eStroke) {
			rsegs.push(...widenStrokeStroke(preArg));
		} else if (s1.sType === SegEnum.eStroke || s3.sType === SegEnum.eStroke) {
			rsegs.push(...widenStrokeArc(preArg));
		} else if (s1.sType === SegEnum.eArc && s3.sType === SegEnum.eArc) {
			rsegs.push(...widenArcArc(preArg));
		} else {
			throw `err127: makeCorner unexpected s1s3.sType ${s1.sType} ${s3.sType}`;
		}
	} else {
		throw `err723: makeCorner unexpected s2.sType ${s2.sType}`;
	}
	//console.log('dbg901: end of makeCorner');
	//for (const seg of rsegs) {
	//	console.log(seg);
	//}
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
