// sub_design.ts

type tMParams = { [index: string]: number };

type tRParam = {
	min: number;
	max: number;
	step: number;
};
type tRParams = { [index: string]: tRParam };

type tPosiOrien = [number, number, number];

type tSubInst = {
	partName: string;
	package: string;
	mandatories: tMParams;
	recommended: tMParams;
	restricted: tRParams;
	orientation: tPosiOrien;
	position: tPosiOrien;
};

type tSubDesign = { [index: string]: tSubInst };

export type { tMParams, tRParams, tSubInst, tSubDesign };
