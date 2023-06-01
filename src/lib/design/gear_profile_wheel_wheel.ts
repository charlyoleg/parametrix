// gear_profile_wheel_wheel.ts

import { contour, contourCircle, figure } from '$lib/geom/figure';
import type { tParamDef, tParamVal, tGeom, tPageDef } from './aaParamGeom';

const pDef: tParamDef = {
	page: 'gear_profile_wheel_wheel',
	params: [
		{ name: 'm', unit: 'mm', init: 1, min: 0.01, max: 1000, step: 0.01 },
		{ name: 'n1', unit: 'scalar', init: 23, min: 3, max: 1000, step: 1 },
		{ name: 'n2', unit: 'scalar', init: 19, min: 3, max: 1000, step: 1 }
	],
	paramSvg: {
		n1: 'default_param_blank.svg',
		n2: 'default_param_blank.svg',
		r1: 'default_param_blank.svg'
	},
	sim: {
		tMax: 10,
		tStep: 0.5,
		tUpdate: 500 // every 0.5 second
	}
};

function pGeom(t: number, param: tParamVal): tGeom {
	const rGeome: tGeom = { fig: figure(), logstr: '', calcErr: true };
	rGeome.logstr += `simTime: ${t}\n`;
	try {
		const mod = param['m'];
		const n1 = param['n1'];
		const n2 = param['n2'];
		const circle_ref_1 = contourCircle(0, 0, (2 * mod) / n1);
		rGeome.logstr += circle_ref_1.check();
		rGeome.fig.addDynamics(circle_ref_1);
		const ctrZ = contour(0, 0)
			.addSegStrokeR((2 * mod) / n1, 0)
			.addSegStrokeR(0, (2 * mod) / n2)
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
