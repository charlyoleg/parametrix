// volume.ts

enum EExtrude {
	eLinearOrtho,
	//eLinear,
	//eAlongPath,
	//eTwisted,
	eRotate
}

interface tExtrude {
	outName: string;
	face: string;
	extrudeMethod: EExtrude;
	length?: number;
	rotate: [number, number, number];
	translate: [number, number, number];
}

enum EBVolume {
	eIdentity,
	eIntersection,
	eUnion,
	eSubstraction
}

interface tBVolume {
	outName: string;
	boolMethod: EBVolume;
	inList: string[];
}

interface tVolume {
	extrudes: tExtrude[];
	volumes: tBVolume[];
}

export type { tVolume, tExtrude, tBVolume };
export { EExtrude, EBVolume };
