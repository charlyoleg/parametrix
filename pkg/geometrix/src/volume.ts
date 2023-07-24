// volume.ts

enum EExtrude {
	eLinearOrtho,
	//eLinear,
	//eAlongPath,
	//eTwisted,
	eRotate
}

type tExtrude = {
	outName: string;
	face: string;
	extrudeMethod: EExtrude;
	length: number;
};

enum EBVolume {
	eIdentity,
	eIntersection,
	eUnion,
	eSubstraction
}

type tBVolume = {
	outName: string;
	boolMethod: EBVolume;
	inList: Array<string>;
};

type tVolume = {
	extrudes: Array<tExtrude>;
	volumes: Array<tBVolume>;
};

export type { tVolume };
