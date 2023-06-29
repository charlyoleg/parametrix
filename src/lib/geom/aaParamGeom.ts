// aaParamGeom.ts

import type { Figure } from './figure';
import { figure } from './figure';

enum PType {
	eNumber,
	eCheckbox,
	eDropdown
}

type tParam = {
	name: string;
	unit: string;
	init: number;
	min: number;
	max: number;
	step: number;
	dropdown: Array<string>;
	pType: PType;
};
type tSimTime = {
	tMax: number;
	tStep: number;
	tUpdate: number; // in ms
};
type tParamDef = {
	page: string;
	params: Array<tParam>;
	paramSvg: { [index: string]: string };
	sim: tSimTime;
};

type tParamVal = { [index: string]: number };
type tAllVal = { lastModif: string; pVal: tParamVal; comment: string };
type tFaces = { [index: string]: Figure };
type tGeom = {
	fig: tFaces;
	logstr: string;
	calcErr: boolean;
};
type tGeomFunc = (t: number, ipVal: tParamVal) => tGeom;

type tPageDef = {
	pTitle: string;
	pDescription: string;
	pDef: tParamDef;
	pGeom: tGeomFunc;
};

function mergeFaces(iFaces: tFaces): Figure {
	const rfig = figure();
	for (const face in iFaces) {
		const fig = iFaces[face];
		for (const ipoint of fig.pointList) {
			rfig.pointList.push(ipoint);
		}
		for (const iline of fig.lineList) {
			rfig.lineList.push(iline);
		}
		for (const ivector of fig.vectorList) {
			rfig.vectorList.push(ivector);
		}
		for (const ctr of fig.mainList) {
			rfig.mainList.push(ctr);
		}
		for (const ctr of fig.mainBList) {
			rfig.mainBList.push(ctr);
		}
		for (const ctr of fig.secondList) {
			rfig.secondList.push(ctr);
		}
		for (const ctr of fig.secondBList) {
			rfig.secondBList.push(ctr);
		}
		for (const ctr of fig.dynamicsList) {
			rfig.dynamicsList.push(ctr);
		}
	}
	return rfig;
}

function pNumber(name: string, unit: string, init: number, min = 0, max = 100, step = 1): tParam {
	const rParam: tParam = {
		name: name,
		unit: unit,
		init: init,
		min: min,
		max: max,
		step: step,
		dropdown: [],
		pType: PType.eNumber
	};
	return rParam;
}
function pCheckbox(name: string, init: boolean): tParam {
	const rParam: tParam = {
		name: name,
		unit: 'checkbox',
		init: init ? 1 : 0,
		min: 0,
		max: 1,
		step: 1,
		dropdown: [],
		pType: PType.eCheckbox
	};
	return rParam;
}
function pDropdown(name: string, values: Array<string>): tParam {
	const rParam: tParam = {
		name: name,
		unit: 'dropdown',
		init: 0,
		min: 0,
		max: values.length - 1,
		step: 1,
		dropdown: values,
		pType: PType.eDropdown
	};
	return rParam;
}

function fround(ireal: number, iprecision = 1000.0): number {
	return Math.floor(ireal * iprecision) / iprecision;
}

export type { tParamDef, tParamVal, tAllVal, tGeom, tGeomFunc, tPageDef };
export { mergeFaces, PType, pNumber, pCheckbox, pDropdown, fround };
