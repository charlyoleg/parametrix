// write_pax.ts

import type { tFaces } from './figure';
import type { tVolume } from './volume';
import type { tSubDesign } from './sub_design';
import type { tGeom, tParamVal } from './aaParamGeom';
import type { tPaxContour } from './prepare_pax';
import type { tContour } from './contour';

type tPaxFaces = { [index: string]: Array<tPaxContour> };
type tPaxJson = {
	partName: string;
	params: tParamVal;
	faces: tPaxFaces;
	volume: tVolume;
	subs: tSubDesign;
	log: string;
};

class PaxWrite {
	//constructor() {}
	figureToPaxF(aCtr: Array<tContour>): Array<tPaxContour> {
		const rPaxF: Array<tPaxContour> = [];
		for (const ctr of aCtr) {
			rPaxF.push(ctr.toPax());
		}
		return rPaxF;
	}
	getFigures(figs: tFaces): tPaxFaces {
		const figFaces: tPaxFaces = {};
		for (const face in figs) {
			const figu = this.figureToPaxF(figs[face].mainList);
			figFaces[face] = figu;
		}
		return figFaces;
	}
	getPaxJson(paramVal: tParamVal, geome0: tGeom, partName: string): tPaxJson {
		const rPaxJson = {
			partName: partName,
			params: paramVal,
			faces: this.getFigures(geome0.fig),
			volume: geome0.vol,
			subs: geome0.sub,
			log: geome0.logstr
		};
		return rPaxJson;
	}
	getPaxStr(paramVal: tParamVal, geome0: tGeom, partName: string): string {
		const paxJson = this.getPaxJson(paramVal, geome0, partName);
		const rStr = JSON.stringify(paxJson, null, 2);
		return rStr;
	}
}
function paxWrite(): PaxWrite {
	const rPaxWrite = new PaxWrite();
	return rPaxWrite;
}

export type { tPaxFaces, tPaxJson };
export { paxWrite };
