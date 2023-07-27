// sub_design.ts

type tMParams = { [index: string]: number };

type tRParam = {
	min: number;
	max: number;
	step: number;
};
type tRParams = { [index: string]: tRParam };

type tSubPart = {
	package: string;
	mandatories: tMParams;
	recommended: tMParams;
	restricted: tRParams;
};

type tSubDesign = { [index: string]: tSubPart };

export type { tMParams, tRParams, tSubPart, tSubDesign };
