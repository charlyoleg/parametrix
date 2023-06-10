// gear_wheel_wheel.ts

import { contour, contourCircle, figure, degToRad } from '$lib/geom/figure';
import type { tParamDef, tParamVal, tGeom, tPageDef } from './aaParamGeom';
import { gearWheelProfile, gearWheelHelper } from './gearWheelProfile';

const pDef: tParamDef = {
	page: 'gear_wheel_wheel',
	params: [
		{ name: 'module', unit: 'mm', init: 10, min: 0.01, max: 1000, step: 0.01 },
		{ name: 'N1', unit: 'scalar', init: 23, min: 3, max: 1000, step: 1 },
		{ name: 'N2', unit: 'scalar', init: 19, min: 3, max: 1000, step: 1 },
		{ name: 'angleCenterCenter', unit: 'degree', init: 0, min: -180, max: 180, step: 1 },
		{ name: 'addInterAxis', unit: 'mm', init: 0, min: 0, max: 100, step: 0.01 },
		{ name: 'c1x', unit: 'mm', init: 0, min: -200, max: 200, step: 1 },
		{ name: 'c1y', unit: 'mm', init: 0, min: -200, max: 200, step: 1 },
		{ name: 'ah1', unit: 'scalar', init: 1, min: 0.1, max: 2, step: 0.05 },
		{ name: 'dh1', unit: 'scalar', init: 1, min: 0.1, max: 2, step: 0.05 },
		{ name: 'bh1', unit: 'scalar', init: 0.25, min: 0.1, max: 2, step: 0.05 },
		{ name: 'bhr1', unit: 'mm', init: 0.1, min: 0.02, max: 50, step: 0.01 },
		{ name: 'ah2', unit: 'scalar', init: 1, min: 0.1, max: 2, step: 0.05 },
		{ name: 'dh2', unit: 'scalar', init: 1, min: 0.1, max: 2, step: 0.05 },
		{ name: 'bh2', unit: 'scalar', init: 0.25, min: 0.1, max: 2, step: 0.05 },
		{ name: 'bhr2', unit: 'mm', init: 0.1, min: 0.02, max: 50, step: 0.01 },
		{ name: 'at1', unit: '%', init: 50, min: 10, max: 90, step: 0.5 },
		{ name: 'at2', unit: '%', init: 50, min: 10, max: 90, step: 0.5 },
		{ name: 'optimalPressureAngle', unit: 'checkbox', init: 1, min: 0, max: 1, step: 1 },
		{ name: 'brr1', unit: 'mm', init: 50, min: 10, max: 2000, step: 0.01 },
		{ name: 'functioningPressureAngle', unit: 'checkbox', init: 1, min: 0, max: 1, step: 1 },
		{ name: 'brr2', unit: 'mm', init: 50, min: 10, max: 2000, step: 0.01 },
		{ name: 'symetricPressureAngle', unit: 'checkbox', init: 1, min: 0, max: 1, step: 1 },
		{ name: 'blr1', unit: 'mm', init: 50, min: 10, max: 2000, step: 0.01 },
		{ name: 'blr2', unit: 'mm', init: 50, min: 10, max: 2000, step: 0.01 },
		{ name: 'initAngle', unit: 'degree', init: 0, min: -180, max: 180, step: 1 },
		{ name: 'rightLeftCenter', unit: 'dropdown', init: 0, min: 0, max: 2, step: 1 }
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
		bhr1: 'default_param_blank.svg',
		ah2: 'default_param_blank.svg',
		dh2: 'default_param_blank.svg',
		bh2: 'default_param_blank.svg',
		bhr2: 'default_param_blank.svg',
		at1: 'default_param_blank.svg',
		at2: 'default_param_blank.svg',
		optimalPressureAngle: 'default_param_blank.svg',
		brr1: 'default_param_blank.svg',
		functioningPressureAngle: 'default_param_blank.svg',
		brr2: 'default_param_blank.svg',
		symetricPressureAngle: 'default_param_blank.svg',
		blr1: 'default_param_blank.svg',
		blr2: 'default_param_blank.svg',
		initAngle: 'default_param_blank.svg',
		rightLeftCenter: 'default_param_blank.svg'
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
		const gp1 = gearWheelProfile();
		const gp2 = gearWheelProfile();
		gp1.set1ModuleToothNumber(param['module'], param['N1']);
		gp2.set1ModuleToothNumber(param['module'], param['N2']);
		gp1.set2CenterPosition(param['c1x'], param['c1y']);
		const acc = degToRad(param['angleCenterCenter']);
		const [c2x, c2y] = gearWheelHelper.gw2center(gp1, gp2, acc, param['addInterAxis']);
		gp2.set2CenterPosition(c2x, c2y);
		gp1.set3CircleRadius(param['ah1'], param['dh1'], param['bh1'], param['bhr1']);
		gp2.set3CircleRadius(param['ah2'], param['dh2'], param['bh2'], param['bhr2']);
		// base circles
		const functioningPressureAngle = param['functioningPressureAngle'];
		const symetricPressureAngle = param['symetricPressureAngle'];
		let brr1 = param['brr1'];
		let brr2 = param['brr2'];
		let blr1 = param['blr1'];
		let blr2 = param['blr2'];
		if (param['optimalPressureAngle'] === 1) {
			if (gp2.TN > gp1.TN) {
				brr1 = gp1.dr;
				brr2 = (brr1 * gp2.TN) / gp1.TN;
			} else {
				brr2 = gp2.dr;
				brr1 = (brr2 * gp1.TN) / gp2.TN;
			}
			blr1 = brr1;
			blr2 = brr2;
		}
		gp1.set4BaseCircles(brr1, blr1);
		gp2.set4BaseCircles(brr2, blr2);
		gp1.set5AddendumThickness(param['at1']);
		gp2.set5AddendumThickness(param['at2']);
		gp1.set6Angles(degToRad(param['initAngle']), acc);
		const rightLeftCenter = param['rightLeftCenter'];
		gp2.set6Angles(0, acc + Math.PI);
		// construction lines and circles
		for (const refCircle of gp1.getRefCircles()) {
			rGeome.fig.addDynamics(refCircle);
		}
		for (const refCircle of gp2.getRefCircles()) {
			rGeome.fig.addDynamics(refCircle);
		}
		// gearwheel-1
		const gp1p = gp1.getProfile();
		rGeome.logstr += gp1p.check();
		rGeome.fig.addMain(gp1p);
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
