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
type tParams = {
	params: Array<tParam>;
	sim: tSimTime;
};

type tPObj = { [index: string]: number };
type tGeom = Array<Point>;
type tGeomFunc = (t: number, param: tPObj) => tGeom;

function fround(ireal: number, iprecision = 1000.0): number {
	return Math.floor(ireal * iprecision) / iprecision;
}

export type { tParams, tPObj, tGeom, tGeomFunc };
export { fround };
