// sub_design.ts

type tMParam = {
	name: string;
	value: number;
};

type tRParam = {
	name: string;
	min: number;
	max: number;
	step: number;
};

type tSubD = {
	partName: string;
	package: string;
	mandatories: Array<tMParam>;
	recommended: Array<tMParam>;
	restricted: Array<tRParam>;
};

type tSubDesign = Array<tSubD>;

export type { tSubDesign };
