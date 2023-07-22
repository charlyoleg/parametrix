// verify_exports_1.ts

import type { tParamDef, tParamVal, tGeom, tPageDef } from 'geometrix';
import { contour, contourCircle, figure, pNumber, pCheckbox } from 'geometrix';

const pDef: tParamDef = {
	page: 'verify_exports_1',
	params: [
		//pNumber(name, unit, init, min, max, step)
		pCheckbox('circle', true),
		pNumber('circle-size', 'mm', 100, 1, 1000, 1),
		pCheckbox('contour', true),
		pNumber('contour-size', 'mm', 30, 1, 1000, 1),
		pCheckbox('contour-arc-large', false)
	],
	paramSvg: {
		circle: 'default_param_blank.svg',
		'circle-size': 'default_param_blank.svg',
		contour: 'default_param_blank.svg',
		'contour-size': 'default_param_blank.svg',
		'contour-arc-large': 'default_param_blank.svg'
	},
	sim: {
		tMax: 10,
		tStep: 0.1,
		tUpdate: 500
	}
};

function pGeom(t: number, param: tParamVal): tGeom {
	const rGeome: tGeom = { fig: {}, logstr: '', calcErr: true };
	const figOne = figure();
	rGeome.logstr += `simTime: ${t}\n`;
	try {
		if (param['circle'] === 1) {
			const theCircle = contourCircle(0, 0, param['circle-size']);
			figOne.addMain(theCircle);
		}
		if (param['contour'] === 1) {
			const csize = param['contour-size'];
			const carcl = param['contour-arc-large'] === 1 ? true : false;
			const ctr1 = contour(0, 0)
				.addSegStrokeA(csize, 0)
				.addPointA(csize, csize)
				.addSegArc(csize * 0.8, carcl, true)
				.closeSegStroke();
			figOne.addMain(ctr1);
		}
		rGeome.fig = { teethProfile: figOne };
		rGeome.logstr += 'verify_exports_1 draw successfully!\n';
		rGeome.calcErr = false;
	} catch (emsg) {
		rGeome.logstr += emsg;
		console.log(emsg);
	}
	return rGeome;
}

const verifyExports1Def: tPageDef = {
	pTitle: 'Verify exports 1',
	pDescription: 'For dev & debug of Openscad export',
	pDef: pDef,
	pGeom: pGeom
};

export { verifyExports1Def };