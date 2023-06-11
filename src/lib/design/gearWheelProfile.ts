// gearWheelProfile.ts

import type { tContour } from '$lib/geom/figure';
import { contour, contourCircle, point } from '$lib/geom/figure';
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
	construct() {
		this.mod = 1;
	}
	set1ModuleToothNumber(iMod: number, iTN: number) {
		this.mod = iMod;
		this.TN = iTN;
		this.pr = (this.mod * this.TN) / 2;
		this.as = (2 * Math.PI) / this.TN;
	}
	set2CenterPosition(icx: number, icy: number) {
		this.cx = icx;
		this.cy = icy;
	}
	set3CircleRadius(iah: number, idh: number, ibh: number, ibRound: number) {
		this.ar = this.pr + this.mod * iah;
		this.dr = this.pr - this.mod * idh;
		this.br = this.dr - this.mod * ibh;
		this.bRound = ibRound;
	}
	set4BaseCircles(baseRight: number, baseLeft: number) {
		this.brr = baseRight;
		this.blr = baseLeft;
	}
	set5AddendumThickness(iat: number) {
		this.adt = iat / 100;
	}
	set6Angles(initAng: number, axisAng: number) {
		this.initAngle = initAng;
		this.axisAngle = axisAng;
	}
	set7InvoluteDetails(iInvolArcPairs: number, iSkinThickness: number) {
		this.involArcPairs = iInvolArcPairs;
		this.skinThickness = iSkinThickness;
	}
	getRefCircles(): Array<tContour> {
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
	getProfile(): tContour {
		this.calcInvoluteAngles();
		const aDiffRd = this.rwd - this.rwp;
		const aDiffRa = this.rwa - this.rwp;
		const aDiffLd = this.lwd - this.lwp;
		const aDiffLa = this.lwa - this.lwp;
		const erdr = this.dr > this.brr ? this.dr : this.brr;
		const eldr = this.dr > this.blr ? this.dr : this.blr;
		const center = point(this.cx, this.cy);
		// this first point is equal to the first stroke of the loop.
		// Contour will remove it because last and new points are identical
		const first = center.translatePolar(this.initAngle + aDiffRd, this.br);
		const rProfile = contour(first.cx, first.cy);
		for (let i = 0; i < this.TN; i++) {
			// TODO
			const refA = this.initAngle + i * this.as;
			const ptrb = center.translatePolar(refA + aDiffRd, this.br);
			rProfile.addSegStrokeA(ptrb.cx, ptrb.cy);
			const ptrd = center.translatePolar(refA + aDiffRd, erdr);
			rProfile.addSegStrokeA(ptrd.cx, ptrd.cy);
			const ptrp = center.translatePolar(refA, this.pr);
			rProfile.addSegStrokeA(ptrp.cx, ptrp.cy);
			const ptra = center.translatePolar(refA + aDiffRa, this.ar);
			rProfile.addSegStrokeA(ptra.cx, ptra.cy);
			const refAl = refA + this.as * this.adt;
			const ptla = center.translatePolar(refAl + aDiffLa, this.ar);
			rProfile.addSegStrokeA(ptla.cx, ptla.cy);
			const ptlp = center.translatePolar(refAl, this.pr);
			rProfile.addSegStrokeA(ptlp.cx, ptlp.cy);
			const ptld = center.translatePolar(refAl + aDiffLd, eldr);
			rProfile.addSegStrokeA(ptld.cx, ptld.cy);
			const ptlb = center.translatePolar(refAl + aDiffLd, this.br);
			rProfile.addSegStrokeA(ptlb.cx, ptlb.cy);
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

const gwHelper = {
	gw2center: (
		gw1: GearWheelProfile,
		gw2: GearWheelProfile,
		angleCenterCenter: number,
		addInterAxis: number
	): Array<number> => {
		const interAxis = gw1.pr + gw2.pr + addInterAxis;
		const c2x = gw1.cx + interAxis * Math.cos(angleCenterCenter);
		const c2y = gw1.cy + interAxis * Math.sin(angleCenterCenter);
		return [c2x, c2y];
	},
	baseCircles: (
		gw1: GearWheelProfile,
		gw2: GearWheelProfile,
		ibrr1: number,
		iblr1: number,
		ibrr2: number,
		iblr2: number,
		involSym: number,
		involROpt: number,
		involLOpt: number
	): Array<number> => {
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
	},
	initAngle2: (
		initAngle1: number,
		angleCenterCenter: number,
		rightLeftCenter2: number
	): number => {
		let rInitAngle2 = 0;
		// TODO
		if (rightLeftCenter2 === 1) {
			rInitAngle2 = initAngle1 + angleCenterCenter;
		}
		return rInitAngle2;
	}
};

export { gwProfile, gwHelper };
