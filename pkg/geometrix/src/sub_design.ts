// sub_design.ts

type tMParams = Record<string, number>;

interface tRParam {
	min: number;
	max: number;
	step: number;
}
type tRParams = Record<string, tRParam>;

type tPosiOrien = [number, number, number];

interface tSubInst {
	partName: string;
	package: string;
	mandatories: tMParams;
	recommended: tMParams;
	restricted: tRParams;
	orientation: tPosiOrien;
	position: tPosiOrien;
}

type tSubDesign = Record<string, tSubInst>;

export type { tMParams, tRParams, tSubInst, tSubDesign };
