// paramGeom.ts

import type { Point } from '$lib/geom/euclid2d';

type tParam = {
	name: string;
	default: number;
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

type tGeom = Array<Point>;
type tGeomFunc = (t: number) => tGeom;

export type { tParams, tGeom, tGeomFunc };
