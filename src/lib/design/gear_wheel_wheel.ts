// gear_wheel_wheel.ts

//import { contour, contourCircle, figure, degToRad } from '$lib/geom/figure';
import { figure, degToRad, ffix } from '$lib/geom/figure';
import type { tParamDef, tParamVal, tGeom, tPageDef } from './aaParamGeom';
import { pNumber } from './aaParamGeom';
import * as gwHelper from './gearWheelProfile';
import * as welem from './wheelElements';

const pDef: tParamDef = {
	page: 'gear_wheel_wheel',
	params: [
		//pNumber(name, unit, init, min, max, step)
		pNumber('module', 'mm', 10, 0.1, 100, 0.1),
		pNumber('N1', 'scalar', 23, 3, 1000, 1),
		pNumber('N2', 'scalar', 19, 3, 1000, 1),
		pNumber('angleCenterCenter', 'degree', 0, -180, 180, 1),
		pNumber('addInterAxis', 'mm', 0, 0, 100, 0.05),
		pNumber('c1x', 'mm', 0, -200, 200, 1),
		pNumber('c1y', 'mm', 0, -200, 200, 1),
		pNumber('ah1', 'scalar', 1, 0.1, 2, 0.05),
		pNumber('dh1', 'scalar', 1, 0.1, 2, 0.05),
		pNumber('bh1', 'scalar', 0.25, 0.1, 2, 0.05),
		pNumber('bRound1', 'mm', 2, 0, 50, 0.1),
		pNumber('ah2', 'scalar', 1, 0.1, 2, 0.05),
		pNumber('dh2', 'scalar', 1, 0.1, 2, 0.05),
		pNumber('bh2', 'scalar', 0.25, 0.1, 2, 0.05),
		pNumber('bRound2', 'mm', 2, 0, 50, 0.1),
		pNumber('at1', '%', 50, 10, 90, 0.5),
		pNumber('at2', '%', 50, 10, 90, 0.5),
		pNumber('involSym', 'checkbox', 1, 0, 1, 1),
		pNumber('involROpt', 'dropdown', 0, 0, 4, 1),
		pNumber('involLOpt', 'dropdown', 0, 0, 4, 1),
		pNumber('brr1', 'mm', 50, 10, 2000, 0.05),
		pNumber('brr2', 'mm', 50, 10, 2000, 0.05),
		pNumber('blr1', 'mm', 50, 10, 2000, 0.05),
		pNumber('blr2', 'mm', 50, 10, 2000, 0.05),
		pNumber('involArcPairs1', 'scalar', 2, 1, 40, 1),
		pNumber('involArcPairs2', 'scalar', 2, 1, 40, 1),
		pNumber('skinThickness1', 'mm', 0, -3, 3, 0.01),
		pNumber('skinThickness2', 'mm', 0, -3, 3, 0.01),
		pNumber('initAngle1', 'degree', 0, -180, 180, 1),
		pNumber('rightLeftCenter2', 'dropdown', 0, 0, 2, 1),
		pNumber('centralAxis', 'checkbox', 1, 0, 1, 1),
		pNumber('axisRadius', 'mm', 10, 0.1, 200, 0.1),
		pNumber('ribNb', 'scalar', 5, 0, 32, 1),
		pNumber('ribWidth', 'mm', 8, 1, 100, 0.1),
		pNumber('ribHeight', 'mm', 8, 1, 100, 0.1),
		pNumber('ribRound1', 'mm', 2, 0, 20, 0.1),
		pNumber('ribRound2', 'mm', 2, 0, 20, 0.1),
		pNumber('hollow', 'checkbox', 1, 0, 1, 1),
		pNumber('materialHeightExt', 'mm', 20, 1, 200, 0.5),
		pNumber('materialHeightInt', 'mm', 15, 1, 200, 0.5),
		pNumber('spokeNb', 'scalar', 5, 1, 18, 1),
		pNumber('spokeWidth', 'mm', 15, 1, 200, 0.1),
		pNumber('spokeRound', 'mm', 10, 0, 20, 0.1)
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
