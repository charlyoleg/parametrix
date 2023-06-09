// gear_profile_wheel_wheel.ts

import { contour, contourCircle, figure, degToRad } from '$lib/geom/figure';
import type { tParamDef, tParamVal, tGeom, tPageDef } from './aaParamGeom';

const pDef: tParamDef = {
	page: 'gear_profile_wheel_wheel',
	params: [
		{ name: 'module', unit: 'mm', init: 1, min: 0.01, max: 1000, step: 0.01 },
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
		{ name: 'dt1', unit: '%', init: 50, min: 10, max: 90, step: 0.5 },
		{ name: 'at2', unit: '%', init: 50, min: 10, max: 90, step: 0.5 },
		{ name: 'dt2', unit: '%', init: 50, min: 10, max: 90, step: 0.5 },
		{ name: 'optimalPressureAngle', unit: 'checkbox', init: 1, min: 0, max: 1, step: 1 },
		{ name: 'brr1', unit: 'mm', init: 50, min: 10, max: 2000, step: 0.01 },
		{ name: 'functioningPressureAngle', unit: 'checkbox', init: 1, min: 0, max: 1, step: 1 },
		{ name: 'brr2', unit: 'mm', init: 50, min: 10, max: 2000, step: 0.01 },
		{ name: 'symetricPressureAngle', unit: 'checkbox', init: 1, min: 0, max: 1, step: 1 },
		{ name: 'blr1', unit: 'mm', init: 50, min: 10, max: 2000, step: 0.01 },
		{ name: 'blr2', unit: 'mm', init: 50, min: 10, max: 2000, step: 0.01 },
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
		dt1: 'default_param_blank.svg',
		at2: 'default_param_blank.svg',
		dt2: 'default_param_blank.svg',
		optimalPressureAngle: 'default_param_blank.svg',
		brr1: 'default_param_blank.svg',
		functioningPressureAngle: 'default_param_blank.svg',
		brr2: 'default_param_blank.svg',
		symetricPressureAngle: 'default_param_blank.svg',
		blr1: 'default_param_blank.svg',
		blr2: 'default_param_blank.svg',
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
		// re-assign parameters
		const mod = param['module'];
		const N1 = param['N1'];
		const N2 = param['N2'];
		const angleCenterCenter = degToRad(param['angleCenterCenter']);
		const addInterAxis = param['addInterAxis'];
		const c1x = param['c1x'];
		const c1y = param['c1y'];
		const ah1 = param['ah1'];
		const dh1 = param['dh1'];
		const bh1 = param['bh1'];
		const bhr1 = param['bhr1'];
		const ah2 = param['ah2'];
		const dh2 = param['dh2'];
		const bh2 = param['bh2'];
		const bhr2 = param['bhr2'];
		const at1 = param['at1'];
		const dt1 = param['dt1'];
		const at2 = param['at2'];
		const dt2 = param['dt2'];
		const optimalPressureAngle = param['optimalPressureAngle'];
		const brr1 = param['brr1'];
		const functioningPressureAngle = param['functioningPressureAngle'];
		const brr2 = param['brr2'];
		const symetricPressureAngle = param['symetricPressureAngle'];
		const blr1 = param['blr1'];
		const blr2 = param['blr2'];
		const rightLeftCenter = param['rightLeftCenter'];
		// construction lines and circles
		const pr1 = (mod * N1) / 2;
		const circle_primitive_1 = contourCircle(c1x, c1y, pr1);
		rGeome.fig.addDynamics(circle_primitive_1);
		const circle_addendum_1 = contourCircle(c1x, c1y, pr1 + mod * ah1);
		rGeome.fig.addDynamics(circle_addendum_1);
		const circle_dedendum_1 = contourCircle(c1x, c1y, pr1 - mod * dh1);
		rGeome.fig.addDynamics(circle_dedendum_1);
		const circle_bottom_1 = contourCircle(c1x, c1y, pr1 - mod * (dh1 + bh1));
		rGeome.fig.addDynamics(circle_bottom_1);
		const pr2 = (mod * N2) / 2;
		const interAxis = pr1 + pr2 + addInterAxis;
		const c2x = c1x + interAxis * Math.cos(angleCenterCenter);
		const c2y = c1y + interAxis * Math.sin(angleCenterCenter);
		const circle_primitive_2 = contourCircle(c2x, c2y, pr2);
		rGeome.fig.addDynamics(circle_primitive_2);
		const circle_addendum_2 = contourCircle(c2x, c2y, pr2 + mod * ah2);
		rGeome.fig.addDynamics(circle_addendum_2);
		const circle_dedendum_2 = contourCircle(c2x, c2y, pr2 - mod * dh2);
		rGeome.fig.addDynamics(circle_dedendum_2);
		const circle_bottom_2 = contourCircle(c2x, c2y, pr2 - mod * (dh2 + bh2));
		rGeome.fig.addDynamics(circle_bottom_2);
		// gearwheel-1
		const ctrZ = contour(0, 0)
			.addSegStrokeR((2 * mod) / N1, 0)
			.addSegStrokeR(0, (2 * mod) / N2)
			.closeSegStroke();
		rGeome.logstr += ctrZ.check();
		rGeome.fig.addMain(ctrZ);
		rGeome.logstr += 'gear_profile_wheel_wheel draw successfully!\n';
		rGeome.calcErr = false;
	} catch (emsg) {
		rGeome.logstr += emsg;
		console.log(emsg);
	}
	return rGeome;
}

const pageDef: tPageDef = {
	pTitle: 'Gear-profile for wheel-wheel',
	pDescription: 'Analysing gear-profile',
	pDef: pDef,
	pGeom: pGeom
};

export { pageDef };
