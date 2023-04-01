// paramGeom.ts

import type { Point } from '$lib/geom/euclid2d';

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
type tGeom = {
	points: Array<Point>;
	logstr: string;
};
type tGeomFunc = (t: number, ipVal: tParamVal) => tGeom;

function fround(ireal: number, iprecision = 1000.0): number {
	return Math.floor(ireal * iprecision) / iprecision;
}

export type { tParamDef, tParamVal, tGeom, tGeomFunc };
export { fround };
