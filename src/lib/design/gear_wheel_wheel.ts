// gear_wheel_wheel.ts

//import { contour, contourCircle, figure, degToRad } from '$lib/geom/figure';
import { figure, degToRad, ffix } from '$lib/geom/figure';
import type { tParamDef, tParamVal, tGeom, tPageDef } from './aaParamGeom';
import * as gwHelper from './gearWheelProfile';
import * as welem from './wheelElements';

const pDef: tParamDef = {
	page: 'gear_wheel_wheel',
	params: [
		{ name: 'module', unit: 'mm', init: 10, min: 0.01, max: 1000, step: 0.1 },
		{ name: 'N1', unit: 'scalar', init: 23, min: 3, max: 1000, step: 1 },
		{ name: 'N2', unit: 'scalar', init: 19, min: 3, max: 1000, step: 1 },
		{ name: 'angleCenterCenter', unit: 'degree', init: 0, min: -180, max: 180, step: 1 },
		{ name: 'addInterAxis', unit: 'mm', init: 0, min: 0, max: 100, step: 0.05 },
		{ name: 'c1x', unit: 'mm', init: 0, min: -200, max: 200, step: 1 },
		{ name: 'c1y', unit: 'mm', init: 0, min: -200, max: 200, step: 1 },
		{ name: 'ah1', unit: 'scalar', init: 1, min: 0.1, max: 2, step: 0.05 },
		{ name: 'dh1', unit: 'scalar', init: 1, min: 0.1, max: 2, step: 0.05 },
		{ name: 'bh1', unit: 'scalar', init: 0.25, min: 0.1, max: 2, step: 0.05 },
		{ name: 'bRound1', unit: 'mm', init: 2, min: 0, max: 50, step: 0.1 },
		{ name: 'ah2', unit: 'scalar', init: 1, min: 0.1, max: 2, step: 0.05 },
		{ name: 'dh2', unit: 'scalar', init: 1, min: 0.1, max: 2, step: 0.05 },
		{ name: 'bh2', unit: 'scalar', init: 0.25, min: 0.1, max: 2, step: 0.05 },
		{ name: 'bRound2', unit: 'mm', init: 2, min: 0, max: 50, step: 0.1 },
		{ name: 'at1', unit: '%', init: 50, min: 10, max: 90, step: 0.5 },
		{ name: 'at2', unit: '%', init: 50, min: 10, max: 90, step: 0.5 },
		{ name: 'involSym', unit: 'checkbox', init: 1, min: 0, max: 1, step: 1 },
		{ name: 'involROpt', unit: 'dropdown', init: 0, min: 0, max: 4, step: 1 },
		{ name: 'involLOpt', unit: 'dropdown', init: 0, min: 0, max: 4, step: 1 },
		{ name: 'brr1', unit: 'mm', init: 50, min: 10, max: 2000, step: 0.05 },
		{ name: 'brr2', unit: 'mm', init: 50, min: 10, max: 2000, step: 0.05 },
		{ name: 'blr1', unit: 'mm', init: 50, min: 10, max: 2000, step: 0.05 },
		{ name: 'blr2', unit: 'mm', init: 50, min: 10, max: 2000, step: 0.05 },
		{ name: 'involArcPairs1', unit: 'scalar', init: 2, min: 1, max: 40, step: 1 },
		{ name: 'involArcPairs2', unit: 'scalar', init: 2, min: 1, max: 40, step: 1 },
		{ name: 'skinThickness1', unit: 'mm', init: 0, min: -3, max: 3, step: 0.01 },
		{ name: 'skinThickness2', unit: 'mm', init: 0, min: -3, max: 3, step: 0.01 },
		{ name: 'initAngle1', unit: 'degree', init: 0, min: -180, max: 180, step: 1 },
		{ name: 'rightLeftCenter2', unit: 'dropdown', init: 0, min: 0, max: 2, step: 1 },
		{ name: 'centralAxis', unit: 'checkbox', init: 1, min: 0, max: 1, step: 1 },
		{ name: 'axisRadius', unit: 'mm', init: 10, min: 0.1, max: 200, step: 0.1 },
		{ name: 'ribNb', unit: 'scalar', init: 5, min: 0, max: 32, step: 1 },
		{ name: 'ribWidth', unit: 'mm', init: 8, min: 1, max: 100, step: 0.1 },
		{ name: 'ribHeight', unit: 'mm', init: 8, min: 1, max: 100, step: 0.1 },
		{ name: 'ribRound1', unit: 'mm', init: 2, min: 0, max: 20, step: 0.1 },
		{ name: 'ribRound2', unit: 'mm', init: 2, min: 0, max: 20, step: 0.1 },
		{ name: 'hollow', unit: 'checkbox', init: 1, min: 0, max: 1, step: 1 },
		{ name: 'materialHeightExt', unit: 'mm', init: 20, min: 1, max: 200, step: 0.5 },
		{ name: 'materialHeightInt', unit: 'mm', init: 15, min: 1, max: 200, step: 0.5 },
		{ name: 'spokeNb', unit: 'scalar', init: 5, min: 1, max: 18, step: 1 },
		{ name: 'spokeWidth', unit: 'mm', init: 15, min: 1, max: 200, step: 0.1 },
		{ name: 'spokeRound', unit: 'mm', init: 10, min: 0, max: 20, step: 0.1 }
	],
	paramSvg: {
		module: 'default_param_blank.svg',
		N1: 'default_param_blank.svg',
		N2: 'default_param_blank.svg',
		angleCenterCenter: 'default_param_blank.svg',
		addInterAxis: 'default_param_blank.svg',
		c1x: 'default_param_blank.svg',
		c1y: 'default_param_blank.svg',
		ah1: 'default_param_blank.svg',
		dh1: 'default_param_blank.svg',
		bh1: 'default_param_blank.svg',
		bRound1: 'default_param_blank.svg',
		ah2: 'default_param_blank.svg',
		dh2: 'default_param_blank.svg',
		bh2: 'default_param_blank.svg',
		bRound2: 'default_param_blank.svg',
		at1: 'default_param_blank.svg',
		at2: 'default_param_blank.svg',
		involSym: 'default_param_blank.svg',
		involROpt: 'default_param_blank.svg',
		involLOpt: 'default_param_blank.svg',
		brr1: 'default_param_blank.svg',
		brr2: 'default_param_blank.svg',
		blr1: 'default_param_blank.svg',
		blr2: 'default_param_blank.svg',
		involArcPairs1: 'default_param_blank.svg',
		skinThickness1: 'default_param_blank.svg',
		involArcPairs2: 'default_param_blank.svg',
		skinThickness2: 'default_param_blank.svg',
		initAngle1: 'default_param_blank.svg',
		rightLeftCenter2: 'default_param_blank.svg',
		centralAxis: 'default_param_blank.svg',
		axisRadius: 'default_param_blank.svg',
		ribNb: 'default_param_blank.svg',
		ribWidth: 'default_param_blank.svg',
		ribHeight: 'default_param_blank.svg',
		ribRound1: 'default_param_blank.svg',
		ribRound2: 'default_param_blank.svg',
		hollow: 'default_param_blank.svg',
		materialHeightExt: 'default_param_blank.svg',
		materialHeightInt: 'default_param_blank.svg',
		spokeNb: 'default_param_blank.svg',
		spokeWidth: 'default_param_blank.svg',
		spokeRound: 'default_param_blank.svg'
	},
	sim: {
		tMax: 100,
		tStep: 0.5,
		tUpdate: 500 // every 0.5 second
	}
};

function pGeom(t: number, param: tParamVal): tGeom {
	const rGeome: tGeom = { fig: figure(), logstr: '', calcErr: true };
	rGeome.logstr += `simTime: ${t}\n`;
	try {
		// re-arrange parameters
		const gp1 = gwHelper.gwProfile();
		const gp2 = gwHelper.gwProfile();
		gp1.set1ModuleToothNumber(param['module'], param['N1']);
		gp2.set1ModuleToothNumber(param['module'], param['N2']);
		gp1.set2CenterPosition(param['c1x'], param['c1y']);
		const acc = degToRad(param['angleCenterCenter']);
		const [c2x, c2y, d12] = gwHelper.gw2center(gp1, gp2, acc, param['addInterAxis']);
		gp2.set2CenterPosition(c2x, c2y);
		gp1.set3CircleRadius(param['ah1'], param['dh1'], param['bh1'], param['bRound1']);
		gp2.set3CircleRadius(param['ah2'], param['dh2'], param['bh2'], param['bRound2']);
		// base circles
		const [brr1, blr1, brr2, blr2] = gwHelper.baseCircles(
			gp1,
			gp2,
			param['brr1'],
			param['blr1'],
			param['brr2'],
			param['blr2'],
			param['involSym'],
			param['involROpt'],
			param['involROpt']
		);
		gp1.set4BaseCircles(brr1, blr1);
		gp2.set4BaseCircles(brr2, blr2);
		gp1.set5AddendumThickness(param['at1']);
		gp2.set5AddendumThickness(param['at2']);
		const initAngle1 = degToRad(param['initAngle1']) + (t * 3 * gp1.as) / 100; // sim.tMax=100
		gp1.set6Angles(initAngle1, acc);
		const gearAL = gwHelper.actionLine(
			gp1,
			gp2,
			initAngle1,
			acc,
			d12,
			param['rightLeftCenter2']
		);
		gearAL.prepare();
		for (const laCtr of gearAL.getContours()) {
			rGeome.fig.addDynamics(laCtr);
		}
		rGeome.fig.addPoints(gearAL.getContactPoint());
		gp2.set6Angles(gearAL.getInitAngle2(), acc + Math.PI);
		rGeome.logstr += gearAL.getMsg();
		gp1.set7InvoluteDetails(param['involArcPairs1'], param['skinThickness1']);
		gp2.set7InvoluteDetails(param['involArcPairs2'], param['skinThickness2']);
		// construction lines and circles
		for (const refCircle of gp1.getRefCircles()) {
			rGeome.fig.addDynamics(refCircle);
		}
		for (const refCircle of gp2.getRefCircles()) {
			rGeome.fig.addDynamics(refCircle);
		}
		rGeome.fig.addDynamics(gp1.getToothRef());
		rGeome.fig.addDynamics(gp2.getToothRef());
		// gearwheel-1
		const gp1p = gp1.getProfile();
		rGeome.logstr += gp1.getMsg();
		rGeome.logstr += gp1p.check();
		rGeome.fig.addMain(gp1p);
		if (param['centralAxis'] === 1) {
			const g1axis = welem.axisTorque(
				gp1.cx,
				gp1.cy,
				param['axisRadius'],
				param['ribNb'],
				param['ribWidth'],
				param['ribHeight'],
				param['ribRound1'],
				param['ribRound2'],
				initAngle1
			);
			rGeome.logstr += g1axis.check();
			rGeome.fig.addMain(g1axis);
		}
		if (param['hollow'] === 1) {
			const materialHeightExtMax = gp1.br;
			const materialHeightIntMin = param['axisRadius'] + param['ribHeight'];
			const hollowMaterialExt = materialHeightExtMax - param['materialHeightExt'];
			const hollowMaterialInt = materialHeightIntMin + param['materialHeightInt'];
			if (hollowMaterialInt > hollowMaterialExt) {
				throw `err902: hollowMaterialInt ${ffix(
					hollowMaterialInt
				)} bigger than hollowMaterialExt ${ffix(hollowMaterialExt)}`;
			}
			const g1hollow = welem.hollowStraight(
				gp1.cx,
				gp1.cy,
				hollowMaterialExt,
				hollowMaterialInt,
				param['spokeNb'],
				param['spokeWidth'],
				param['spokeRound'],
				initAngle1
			);
			for (const g1hollowE of g1hollow) {
				rGeome.logstr += g1hollowE.check();
				rGeome.fig.addMain(g1hollowE);
			}
		}
		const gp2p = gp2.getProfile();
		rGeome.logstr += gp2p.check();
		rGeome.fig.addSecond(gp2p);
		rGeome.logstr += 'gear_wheel_wheel draw successfully!\n';
		rGeome.calcErr = false;
	} catch (emsg) {
		rGeome.logstr += emsg;
		console.log(emsg);
	}
	return rGeome;
}

const pageDef: tPageDef = {
	pTitle: 'Gearwheel-gearwheel',
	pDescription: 'Gear-system with two wheels',
	pDef: pDef,
	pGeom: pGeom
};

export { pageDef };
