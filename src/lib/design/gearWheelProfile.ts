// gearWheelProfile.ts

import type { tContour } from '$lib/geom/figure';
import {
	contour,
	contourCircle,
	point,
	withinPiPi,
	radToDeg,
	roundZero,
	ffix
} from '$lib/geom/figure';
//import type { Involute } from './involute';
import { involute } from './involute';

class GearWheelProfile {
	mod = 1;
	TN = 23;
	as = 1;
	cx = 0;
	cy = 0;
	brr = 50;
	blr = 50;
	ar = 54;
	pr = 53;
	dr = 52;
	br = 51;
	bRound = 1;
	adt = 0.5;
	initAngle = 0;
	axisAngle = 0;
	involArcPairs = 1;
	skinThickness = 0;
	involuteR = involute(0, 0, 50, 0, true);
	involuteL = involute(0, 0, 50, 0, false);
	rud = 0;
	rup = 0;
	rua = 0;
	rwd = 0;
	rwp = 0;
	rwa = 0;
	lud = 0;
	lup = 0;
	lua = 0;
	lwd = 0;
	lwp = 0;
	lwa = 0;
	initStep = 0;
	constructor() {
		this.mod = 1;
		this.initStep = 0;
	}
	incInitStep(target: number) {
		if (this.initStep + 1 !== target) {
			throw `err834: incInitStep initStep ${this.initStep} and target ${target} are not compatible`;
		}
		this.initStep = target;
	}
	checkInitStep(targetMin: number, msg: string) {
		if (this.initStep < targetMin) {
			throw `err835: checkInitStep for ${msg} initStep ${this.initStep} is too small compare to targetMin ${targetMin}`;
		}
	}
	set1ModuleToothNumber(iMod: number, iTN: number) {
		this.incInitStep(1);
		this.mod = iMod;
		this.TN = iTN;
		this.pr = (this.mod * this.TN) / 2;
		this.as = (2 * Math.PI) / this.TN;
	}
	set2CenterPosition(icx: number, icy: number) {
		this.incInitStep(2);
		this.cx = icx;
		this.cy = icy;
	}
	set3CircleRadius(iah: number, idh: number, ibh: number, ibRound: number) {
		this.incInitStep(3);
		this.ar = this.pr + this.mod * iah;
		this.dr = this.pr - this.mod * idh;
		this.br = this.dr - this.mod * ibh;
		this.bRound = ibRound;
	}
	set4BaseCircles(baseRight: number, baseLeft: number) {
		this.incInitStep(4);
		this.brr = baseRight;
		this.blr = baseLeft;
	}
	set5AddendumThickness(iat: number) {
		this.incInitStep(5);
		this.adt = iat / 100;
	}
	set6Angles(initAng: number, axisAng: number) {
		this.incInitStep(6);
		this.initAngle = initAng;
		this.axisAngle = axisAng;
	}
	set7InvoluteDetails(iInvolArcPairs: number, iSkinThickness: number) {
		this.incInitStep(7);
		this.involArcPairs = iInvolArcPairs;
		this.skinThickness = iSkinThickness;
	}
	getRefCircles(): Array<tContour> {
		this.checkInitStep(4, 'getRefCircles');
		const rRefCircles = [
			contourCircle(this.cx, this.cy, this.ar),
			contourCircle(this.cx, this.cy, this.pr),
			contourCircle(this.cx, this.cy, this.dr),
			contourCircle(this.cx, this.cy, this.br),
			contourCircle(this.cx, this.cy, this.brr),
			contourCircle(this.cx, this.cy, this.blr)
		];
		return rRefCircles;
	}
	calcInvoluteAngles() {
		this.checkInitStep(4, 'calcInvoluteAngles');
		this.involuteR = involute(this.cx, this.cy, this.brr, 0, true);
		if (this.dr > this.brr) {
			this.rud = this.involuteR.uFromL(this.dr);
		} else {
			this.rud = 0;
		}
		this.rup = this.involuteR.uFromL(this.pr);
		this.rua = this.involuteR.uFromL(this.ar);
		this.rwd = this.involuteR.wFromU(this.rud);
		this.rwp = this.involuteR.wFromU(this.rup);
		this.rwa = this.involuteR.wFromU(this.rua);
		this.involuteL = involute(this.cx, this.cy, this.blr, 0, false);
		if (this.dr > this.blr) {
			this.lud = this.involuteL.uFromL(this.dr);
		} else {
			this.rud = 0;
		}
		this.lup = this.involuteL.uFromL(this.pr);
		this.lua = this.involuteL.uFromL(this.ar);
		this.lwd = this.involuteL.wFromU(this.lud);
		this.lwp = this.involuteL.wFromU(this.lup);
		this.lwa = this.involuteL.wFromU(this.lua);
	}
	getToothRef(): tContour {
		const ptnb = 6 * this.involArcPairs;
		const toothID = 0;
		this.checkInitStep(7, 'getProfile');
		this.calcInvoluteAngles();
		const uPeriodR = (this.rua - this.rud) / ptnb;
		const uPeriodL = (this.lua - this.lud) / ptnb;
		const refA = this.initAngle + toothID * this.as;
		const invoR = involute(this.cx, this.cy, this.brr, refA - this.rwp, true);
		const [p1x, p1y] = invoR.ptc(this.rud + 0 * uPeriodR);
		const rCtr = contour(p1x, p1y);
		for (let j = 0; j < ptnb; j++) {
			const [px, py] = invoR.ptc(this.rud + (j + 1) * uPeriodR);
			rCtr.addSegStrokeA(px, py);
		}
		const refAl = refA + this.as * this.adt;
		const invoL = involute(this.cx, this.cy, this.blr, refAl - this.lwp, false);
		for (let j = 0; j < ptnb + 1; j++) {
			const [px, py] = invoL.ptc(this.lud + (ptnb - j) * uPeriodL);
			rCtr.addSegStrokeA(px, py);
		}
		rCtr.closeSegStroke();
		return rCtr;
	}
	getProfile(): tContour {
		this.checkInitStep(7, 'getProfile');
		this.calcInvoluteAngles();
		const aDiffRd = this.rwd - this.rwp;
		//const aDiffRa = this.rwa - this.rwp;
		const aDiffLd = this.lwd - this.lwp;
		const aDiffLa = this.lwa - this.lwp;
		const erdr = this.dr > this.brr ? this.dr : this.brr;
		const eldr = this.dr > this.blr ? this.dr : this.blr;
		if (this.bRound > erdr - this.br) {
			throw `err409: getProfile bRound ${ffix(this.bRound)} too large for erdr ${ffix(
				erdr
			)} and br ${ffix(this.br)}`;
		}
		if (this.bRound > eldr - this.br) {
			throw `err408: getProfile bRound ${ffix(this.bRound)} too large for eldr ${ffix(
				eldr
			)} and br ${ffix(this.br)}`;
		}
		const uPeriodR = (this.rua - this.rud) / this.involArcPairs;
		const uPeriodL = (this.lua - this.lud) / this.involArcPairs;
		const center = point(this.cx, this.cy);
		// this first point is equal to the first stroke of the loop.
		// Contour will remove it because last and new points are identical
		const first = center.translatePolar(this.initAngle + aDiffRd, this.br);
		const rProfile = contour(first.cx, first.cy);
		for (let i = 0; i < this.TN; i++) {
			const refA = this.initAngle + i * this.as;
			const ptrb = center.translatePolar(refA + aDiffRd, this.br);
			rProfile.addSegStrokeA(ptrb.cx, ptrb.cy).addCornerRounded(this.bRound);
			const ptrd = center.translatePolar(refA + aDiffRd, erdr);
			rProfile.addSegStrokeA(ptrd.cx, ptrd.cy);
			//const ptrp = center.translatePolar(refA, this.pr);
			//rProfile.addSegStrokeA(ptrp.cx, ptrp.cy);
			//const ptra = center.translatePolar(refA + aDiffRa, this.ar);
			//rProfile.addSegStrokeA(ptra.cx, ptra.cy);
			const invoR = involute(this.cx, this.cy, this.brr, refA - this.rwp, true);
			for (let j = 0; j < this.involArcPairs; j++) {
				const uu1 = this.rud + j * uPeriodR;
				const [px, py] = invoR.ptc(uu1 + uPeriodR);
				const ta1 = invoR.ptcta(uu1);
				const ta2 = invoR.ptcta(uu1 + uPeriodR) + Math.PI;
				//rProfile.addSegStrokeA(px, py);
				rProfile.addPointA(px, py).addSeg2Arcs(ta1, ta2);
			}
			const refAl = refA + this.as * this.adt;
			const ptla = center.translatePolar(refAl + aDiffLa, this.ar);
			rProfile.addSegStrokeA(ptla.cx, ptla.cy);
			//const ptlp = center.translatePolar(refAl, this.pr);
			//rProfile.addSegStrokeA(ptlp.cx, ptlp.cy);
			//const ptld = center.translatePolar(refAl + aDiffLd, eldr);
			//rProfile.addSegStrokeA(ptld.cx, ptld.cy);
			const invoL = involute(this.cx, this.cy, this.blr, refAl - this.lwp, false);
			for (let j = 0; j < this.involArcPairs; j++) {
				const uu1 = this.lud + (this.involArcPairs - j) * uPeriodL;
				const [px, py] = invoL.ptc(uu1 - uPeriodL);
				const ta1 = invoL.ptcta(uu1) + Math.PI;
				const ta2 = invoL.ptcta(uu1 - uPeriodL);
				//rProfile.addSegStrokeA(px, py);
				rProfile.addPointA(px, py).addSeg2Arcs(ta1, ta2);
			}
			const ptlb = center.translatePolar(refAl + aDiffLd, this.br);
			rProfile.addSegStrokeA(ptlb.cx, ptlb.cy).addCornerRounded(this.bRound);
		}
		rProfile.closeSegStroke();
		return rProfile;
	}
}

function gwProfile(): GearWheelProfile {
	const rgwp = new GearWheelProfile();
	return rgwp;
}

enum EInvolOpt {
	Optimum = 0,
	BaseCircle1,
	BaseCircle2,
	PressionAngle,
	DisfunctioningTwoCircles
}

// helper functions
function gw2center(
	gw1: GearWheelProfile,
	gw2: GearWheelProfile,
	angleCenterCenter: number,
	addInterAxis: number
): Array<number> {
	gw1.checkInitStep(1, 'helper.gw2center-1');
	gw2.checkInitStep(1, 'helper.gw2center-2');
	const interAxis = gw1.pr + gw2.pr + addInterAxis;
	const c2x = gw1.cx + interAxis * Math.cos(angleCenterCenter);
	const c2y = gw1.cy + interAxis * Math.sin(angleCenterCenter);
	return [c2x, c2y, interAxis];
}
function baseCircles(
	gw1: GearWheelProfile,
	gw2: GearWheelProfile,
	ibrr1: number,
	iblr1: number,
	ibrr2: number,
	iblr2: number,
	involSym: number,
	involROpt: number,
	involLOpt: number
): Array<number> {
	gw1.checkInitStep(3, 'helper.baseCircles-1');
	gw2.checkInitStep(3, 'helper.baseCircles-2');
	let brr1 = ibrr1;
	let brr2 = ibrr2;
	let blr1 = iblr1;
	let blr2 = iblr2;
	const involROpt2: EInvolOpt = involROpt as EInvolOpt;
	const involLOpt2: EInvolOpt = involLOpt as EInvolOpt;
	if (involROpt2 === EInvolOpt.Optimum) {
		if (gw2.TN > gw1.TN) {
			brr1 = gw1.dr;
			brr2 = (brr1 * gw2.TN) / gw1.TN;
		} else {
			brr2 = gw2.dr;
			brr1 = (brr2 * gw1.TN) / gw2.TN;
		}
	}
	if (involLOpt2 === EInvolOpt.Optimum) {
		if (gw2.TN > gw1.TN) {
			blr1 = gw1.dr;
			blr2 = (blr1 * gw2.TN) / gw1.TN;
		} else {
			blr2 = gw2.dr;
			blr1 = (blr2 * gw1.TN) / gw2.TN;
		}
	}
	if (involSym === 1) {
		blr1 = brr1;
		blr2 = brr2;
	}
	return [brr1, blr1, brr2, blr2];
}

class ActionLine {
	gw1: GearWheelProfile;
	gw2: GearWheelProfile;
	initAngle1: number;
	angleCenterCenter: number;
	interAxis: number;
	rightLeftCenter2: number;
	msg: string;
	apr: number; // angle pressure right
	apl: number; // angle pressure left
	constructor(
		gw1: GearWheelProfile,
		gw2: GearWheelProfile,
		initAngle1: number,
		angleCenterCenter: number,
		interAxis: number,
		rightLeftCenter2: number
	) {
		// initialized members
		this.gw1 = gw1;
		this.gw2 = gw2;
		this.initAngle1 = initAngle1;
		this.angleCenterCenter = angleCenterCenter;
		this.interAxis = interAxis;
		this.rightLeftCenter2 = rightLeftCenter2;
		// computed members
		this.msg = '';
		this.apr = 0;
		this.apl = 0;
	}
	check1() {
		this.gw1.checkInitStep(4, 'helper.initAngle2-1');
		this.gw2.checkInitStep(4, 'helper.initAngle2-2');
		if (this.interAxis > this.gw1.ar + this.gw2.ar) {
			this.msg += `warn333: initAngle2 interAxis ${ffix(
				this.interAxis
			)} is too large compare to gw1.ar ${ffix(this.gw1.ar)} and gw2.ar ${ffix(
				this.gw2.ar
			)}\n`;
		}
		//const dOFr = (interAxis * gw1.brr) / (gw1.brr + gw2.brr);
		//const dOFl = (interAxis * gw1.blr) / (gw1.blr + gw2.blr);
		//const apr = Math.acos(gw1.brr / dOFr);
		//const apl = Math.acos(gw1.blr / dOFl);
		this.apr = Math.acos((this.gw1.brr + this.gw2.brr) / this.interAxis);
		this.apl = Math.acos((this.gw1.blr + this.gw2.blr) / this.interAxis);
		this.msg += `Pressure angular: right: ${ffix(radToDeg(this.apr))} left: ${ffix(
			radToDeg(this.apl)
		)} degree\n`;
		if (roundZero(this.gw1.brr * this.gw2.TN - this.gw2.brr * this.gw1.TN) !== 0) {
			this.msg += `warn407: right ratios differ N1/N2 = ${this.gw1.TN} / ${
				this.gw2.TN
			} = ${ffix(this.gw1.TN / this.gw2.TN)} and brr1/brr2 = ${ffix(this.gw1.brr)}/${ffix(
				this.gw2.brr
			)} = ${ffix(this.gw1.brr / this.gw2.brr)}\n`;
		}
		if (roundZero(this.gw1.blr * this.gw2.TN - this.gw2.blr * this.gw1.TN) !== 0) {
			this.msg += `warn408: left ratios differ N1/N2 = ${this.gw1.TN} / ${
				this.gw2.TN
			} = ${ffix(this.gw1.TN / this.gw2.TN)} and blr1/blr2 = ${ffix(this.gw1.blr)}/${ffix(
				this.gw2.blr
			)} = ${ffix(this.gw1.blr / this.gw2.blr)}\n`;
		}
	}
	getMsg(): string {
		return this.msg;
	}
	getInitAngle2() {
		let rInitAngle2 = 0;
		let initAngle1b = this.initAngle1;
		while (Math.abs(initAngle1b - this.angleCenterCenter) < this.gw1.as / 2) {
			initAngle1b += this.gw1.as;
		}
		// TODO
		if (this.rightLeftCenter2 === 0) {
			rInitAngle2 = this.angleCenterCenter + Math.PI - initAngle1b;
		} else if (this.rightLeftCenter2 === 1) {
			rInitAngle2 = this.initAngle1 + this.angleCenterCenter;
		} else if (this.rightLeftCenter2 === 2) {
			rInitAngle2 = this.initAngle1 + this.angleCenterCenter;
		} else {
			throw `err221: initAngle2 rightLeftCenter2 ${this.rightLeftCenter2} has an unkown value`;
		}
		return withinPiPi(rInitAngle2);
	}
}

function actionLine(
	gw1: GearWheelProfile,
	gw2: GearWheelProfile,
	initAngle1: number,
	angleCenterCenter: number,
	interAxis: number,
	rightLeftCenter2: number
): ActionLine {
	const rAL = new ActionLine(
		gw1,
		gw2,
		initAngle1,
		angleCenterCenter,
		interAxis,
		rightLeftCenter2
	);
	return rAL;
}

export { gwProfile, gw2center, baseCircles, actionLine };
