// aaParamGeom.ts

import type { tFaces } from './figure';
import type { tVolume } from './volume';
import type { tSubDesign } from './sub_design';

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
	partName: string;
	params: Array<tParam>;
	paramSvg: { [index: string]: string };
	sim: tSimTime;
};

type tParamVal = { [index: string]: number };
type tAllVal = { lastModif: string; pVal: tParamVal; comment: string };
type tGeom = {
	calcErr: boolean;
	logstr: string;
	fig: tFaces;
	vol: tVolume;
	sub: tSubDesign;
};
type tGeomFunc = (t: number, ipVal: tParamVal) => tGeom;

type tPageDef = {
	pTitle: string;
	pDescription: string;
	pDef: tParamDef;
	pGeom: tGeomFunc;
};

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

function initGeom(): tGeom {
	const rGeom: tGeom = {
		calcErr: true,
		logstr: '',
		fig: {},
		vol: { extrudes: [], volumes: [] },
		sub: {}
	};
	return rGeom;
}

export type { tParamDef, tParamVal, tAllVal, tGeom, tGeomFunc, tPageDef };
export { PType, pNumber, pCheckbox, pDropdown, fround, initGeom };
