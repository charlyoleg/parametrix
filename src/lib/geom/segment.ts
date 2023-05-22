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
	roundZero,
	withinZero2Pi,
	withinPiPi,
	//withinZeroPi,
	//withinHPiHPi,
	within2Pi2Pi
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

class SegDbgPts {
	debugPoints: Array<Point>;
	constructor() {
		this.debugPoints = [];
	}
	add(ip: Point) {
		this.debugPoints.push(ip);
	}
	getDbgPts(): Array<Point> {
		return this.debugPoints;
	}
	clearDbgPts() {
		this.debugPoints = [];
	}
}
const gSegDbgPts = new SegDbgPts();

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
function newStrokeFirst(iseg: Segment2, ip: Point): Segment2 {
	const p8 = ip.clone();
	const p1 = iseg.p1.clone();
	const p2 = iseg.p2;
	// few checks
	if (iseg.sType !== SegEnum.eStroke) {
		throw `err103: newStrokeFirst unexpected sType ${iseg.sType}`;
	}
	const distLine = line(0, 0, 0).setFromPoints(p1, p2).distanceToPoint(p8);
	if (roundZero(distLine) !== 0) {
		throw `err104: newStrokeFirst new point not aligned ${distLine} ${p8.cx} ${p8.cy}`;
	}
	const a2 = p1.angleToPoint(p2);
	const a8 = p1.angleToPoint(p8);
	if (roundZero(withinPiPi(a8 - a2)) !== 0) {
		throw `err105: newStrokeFirst new point miss aligned ${a2} ${a8} ${p8.cx} ${p8.cy}`;
	}
	const l18 = p1.distanceToPoint(p8);
	const l12 = p1.distanceToPoint(p2);
	if (l12 < l18) {
		throw `err106: newStrokeFirst new point out of scope ${l12} ${l18} ${p8.cx} ${p8.cy}`;
	}
	// end of few checks
	const p0 = point(0, 0);
	const rNewSeg = new Segment2(SegEnum.eStroke, p1, p8, p0, 0, 0, 0, false);
	return rNewSeg;
}
function newStrokeSecond(iseg: Segment2, ip: Point): Segment2 {
	const p9 = ip.clone();
	const p3 = iseg.p2.clone();
	const p2 = iseg.p1;
	// few checks
	if (iseg.sType !== SegEnum.eStroke) {
		throw `err203: newStrokeSecond unexpected sType ${iseg.sType}`;
	}
	const distLine = line(0, 0, 0).setFromPoints(p3, p2).distanceToPoint(p9);
	if (roundZero(distLine) !== 0) {
		throw `err204: newStrokeSecond new point not aligned ${distLine} ${p9.cx} ${p9.cy}`;
	}
	const a2 = p3.angleToPoint(p2);
	const a9 = p3.angleToPoint(p9);
	if (roundZero(withinPiPi(a9 - a2)) !== 0) {
		throw `err205: newStrokeSecond new point miss aligned ${a2} ${a9} ${p9.cx} ${p9.cy}`;
	}
	const l39 = p3.distanceToPoint(p9);
	const l32 = p3.distanceToPoint(p2);
	if (l32 < l39) {
		throw `err206: newStrokeSecond new point out of scope ${l32} ${l39} ${p9.cx} ${p9.cy}`;
	}
	// end of few checks
	const p0 = point(0, 0);
	const rNewSeg = new Segment2(SegEnum.eStroke, p9, p3, p0, 0, 0, 0, false);
	return rNewSeg;
}
function newArcFirst(iseg: Segment2, ip: Point): Segment2 {
	if (iseg.sType !== SegEnum.eArc) {
		throw `err203: newArcFirst unexpected sType ${iseg.sType}`;
	}
	const p1 = iseg.p1.clone();
	const p4 = iseg.pc.clone();
	const p8 = ip.clone();
	const a48 = p4.angleToPoint(p8);
	// check arc angleq are properly reduced
	const a4orig = within2Pi2Pi(iseg.a2 - iseg.a1);
	const a4new = within2Pi2Pi(a48 - iseg.a1);
	if (Math.sign(a4orig) * Math.sign(a4new) < 0 || Math.abs(a4new) > Math.abs(a4orig)) {
		throw `err908: newArcFirst a4new out of a4orig ${a4new} ${a4orig}`;
	}
	const rNewSeg = new Segment2(SegEnum.eArc, p1, p8, p4, iseg.radius, iseg.a1, a48, iseg.arcCcw);
	return rNewSeg;
}
function newArcSecond(iseg: Segment2, ip: Point): Segment2 {
	if (iseg.sType !== SegEnum.eArc) {
		throw `err204: newArcSecond unexpected sType ${iseg.sType}`;
	}
	const p3 = iseg.p2.clone();
	const p5 = iseg.pc.clone();
	const p9 = ip.clone();
	const a59 = p5.angleToPoint(p9);
	// check arc angleq are properly reduced
	const a5orig = within2Pi2Pi(iseg.a1 - iseg.a2);
	const a5new = within2Pi2Pi(a59 - iseg.a2);
	if (Math.sign(a5orig) * Math.sign(a5new) < 0 || Math.abs(a5new) > Math.abs(a5orig)) {
		throw `err907: newArcSecond a5new out of a5orig ${a5new} ${a5orig}`;
	}
	const rNewSeg = new Segment2(SegEnum.eArc, p9, p3, p5, iseg.radius, a59, iseg.a2, iseg.arcCcw);
	return rNewSeg;
}
function newRounded(
	ip8: Point,
	ip9: Point,
	ip7: Point,
	ra: number,
	aph: number,
	abi: number
): Segment2 {
	const p8 = ip8.clone();
	const p9 = ip9.clone();
	const p7 = ip7.clone();
	// few checks
	const l78 = p7.distanceToPoint(p8);
	const l79 = p7.distanceToPoint(p9);
	if (roundZero(l78 - ra) !== 0 || roundZero(l79 - ra) !== 0) {
		throw `err610: newRounded not on circle ${ra} ${l78} ${l79}`;
	}
	const a78 = p7.angleToPoint(p8);
	const a79 = p7.angleToPoint(p9);
	const a873 = withinPiPi(a78 - abi + Math.PI);
	const a973 = withinPiPi(a79 - abi + Math.PI);
	if (Math.abs(a873) > Math.PI / 2 || Math.abs(a973) > Math.PI / 2) {
		throw `warn882: newRounded a873 or a972 larger than PI/2 ${a873} ${a973}`;
	}
	// end of few checks
	const ccw2 = aph > 0 ? false : true;
	const rNewSeg = new Segment2(SegEnum.eArc, p8, p9, p7, ra, a78, a79, ccw2);
	return rNewSeg;
}
function roundStrokeStroke(ag: tPrepare): Array<Segment2> {
	const l7 = Math.abs(ag.ra / Math.sin(ag.aph));
	const l7b = l7 * Math.cos(ag.aph);
	const p7 = ag.p2.translatePolar(ag.abi, l7);
	//const p8 = line(0, 0, 0).setFromPoints(ag.p1, ag.p2).projectPoint(p7);
	//const p9 = line(0, 0, 0).setFromPoints(ag.p2, ag.p3).projectPoint(p7);
	//const p8 = p7.translatePolar(a78, ag.ra);
	//const p9 = p7.translatePolar(a79, ag.ra);
	const p8 = ag.p2.translatePolar(ag.at1, l7b);
	const p9 = ag.p2.translatePolar(ag.at3, l7b);
	const rsegs: Array<Segment2> = [];
	rsegs.push(newStrokeFirst(ag.s1, p8));
	rsegs.push(newRounded(p8, p9, p7, ag.ra, ag.aph, ag.abi));
	rsegs.push(newStrokeSecond(ag.s3, p9));
	return rsegs;
}
function roundStrokeArc(ag: tPrepare): Array<Segment2> {
	const lStroke = line(0, 0, 0).setFromPoints(ag.p1, ag.p2);
	const lStrokep = lStroke.lineParallelDistance(ag.ra, ag.p6);
	const lRadial = line(0, 0, 0).setFromPoints(ag.p2, ag.p5);
	const pA = lStrokep.intersection(lRadial);
	gSegDbgPts.add(ag.p6);
	gSegDbgPts.add(ag.p5);
	gSegDbgPts.add(pA);
	const lA4 = pA.distanceToPoint(ag.p5);
	const aA = ag.p2.angleFromToPoints(ag.p1, ag.p5);
	const ml = modifRadius(ag.aph, ag.s3, ag.ra);
	const a7 = Math.asin((lA4 * Math.sin(aA)) / ml); // law of sinus
	const a5 = Math.PI - Math.abs(aA) - Math.abs(a7);
	const sign5 = ag.s3.arcCcw ? 1 : -1;
	const a47 = ag.p5.angleToPoint(ag.p2) + sign5 * a5;
	const p7 = ag.p5.translatePolar(a47, ml);
	const p9 = ag.p5.translatePolar(a47, ag.s3.radius);
	const a127 = ag.p2.angleFromToPoints(ag.p1, p7);
	const l27 = Math.abs(ag.ra / Math.sin(a127));
	const l28 = l27 * Math.cos(a127);
	const a28 = ag.p2.angleToPoint(ag.p1);
	const p8 = ag.p2.translatePolar(a28, l28);
	gSegDbgPts.add(p7);
	gSegDbgPts.add(p8);
	gSegDbgPts.add(p9);
	const rsegs: Array<Segment2> = [];
	rsegs.push(newStrokeFirst(ag.s1, p8));
	//rsegs.push(newRounded(p8, p9, p7, ag.ra, ag.aph, ag.abi));
	//rsegs.push(newArcSecond(ag.s3, p9));
	rsegs.push(newArcSecond(ag.s3, ag.p2));
	return rsegs;
}
function roundArcStroke(ag: tPrepare): Array<Segment2> {
	const lStroke = line(0, 0, 0).setFromPoints(ag.p3, ag.p2);
	const lStrokep = lStroke.lineParallelDistance(ag.ra, ag.p6);
	const lRadial = line(0, 0, 0).setFromPoints(ag.p2, ag.p4);
	const pA = lStrokep.intersection(lRadial);
	const lA4 = pA.distanceToPoint(ag.p4);
	const aA = ag.p2.angleFromToPoints(ag.p3, ag.p4);
	const ml = modifRadius(ag.aph, ag.s1, ag.ra);
	const a7 = Math.asin((lA4 * Math.sin(aA)) / ml); // law of sinus
	const a4 = Math.PI - Math.abs(aA) - Math.abs(a7);
	const sign4 = ag.s1.arcCcw ? -1 : 1;
	const a47 = ag.p4.angleToPoint(ag.p2) + sign4 * a4;
	const p7 = ag.p4.translatePolar(a47, ml);
	const p8 = ag.p4.translatePolar(a47, ag.s1.radius);
	const a327 = ag.p2.angleFromToPoints(ag.p3, p7);
	const l27 = Math.abs(ag.ra / Math.sin(a327));
	const l29 = l27 * Math.cos(a327);
	const a29 = ag.p2.angleToPoint(ag.p3);
	const p9 = ag.p2.translatePolar(a29, l29);
	const rsegs: Array<Segment2> = [];
	rsegs.push(newArcFirst(ag.s1, p8));
	rsegs.push(newRounded(p8, p9, p7, ag.ra, ag.aph, ag.abi));
	rsegs.push(newStrokeSecond(ag.s3, p9));
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
	const rsegs: Array<Segment2> = [];
	rsegs.push(newArcFirst(ag.s1, p8));
	rsegs.push(newRounded(p8, p9, p7, ag.ra, ag.aph, ag.abi));
	rsegs.push(newArcSecond(ag.s3, p9));
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
		} else if (s1.sType === SegEnum.eStroke && s3.sType === SegEnum.eArc) {
			rsegs.push(...roundStrokeArc(preArg));
		} else if (s1.sType === SegEnum.eArc && s3.sType === SegEnum.eStroke) {
			rsegs.push(...roundArcStroke(preArg));
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
	gSegDbgPts,
	arcSeg1To2,
	arcSeg2To1,
	makeCorner
};
