// aaParamGeom.ts

import type { Figure } from '$lib/geom/figure';

type tParam = {
	name: string;
	unit: string;
	init: number;
	min: number;
	max: number;
	step: number;
};
type tSimTime = {
	tMax: number;
	tStep: number;
	tUpdate: number; // in ms
};
type tParamDef = {
	page: string;
	params: Array<tParam>;
	sim: tSimTime;
};

type tParamVal = { [index: string]: number };
type tAllVal = { lastModif: string; pVal: tParamVal; comment: string };
type tGeom = {
	fig: Figure;
	logstr: string;
};
type tGeomFunc = (t: number, ipVal: tParamVal) => tGeom;

type tPageDef = {
	pTitle: string;
	pDescription: string;
	pDef: tParamDef;
	pGeom: tGeomFunc;
};

function fround(ireal: number, iprecision = 1000.0): number {
	return Math.floor(ireal * iprecision) / iprecision;
}

export type { tParamDef, tParamVal, tAllVal, tGeom, tGeomFunc, tPageDef };
export { fround };
