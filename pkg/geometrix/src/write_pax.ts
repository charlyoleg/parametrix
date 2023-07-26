// write_pax.ts

import type { tFaces } from './figure';
//import type { tVolume } from './volume';
//import type { tSubDesign } from './sub_design';
import type { tGeom, tParamVal } from './aaParamGeom';
import type { tPaxContour } from './prepare_pax';
import type { tContour } from './contour';

type tFaceJson = { [index: string]: Array<tPaxContour> };

class PaxWrite {
	//constructor() {}
	figureToPaxF(aCtr: Array<tContour>): Array<tPaxContour> {
		const rPaxF: Array<tPaxContour> = [];
		for (const ctr of aCtr) {
			rPaxF.push(ctr.toPax());
		}
		return rPaxF;
	}
	getFigures(figs: tFaces): tFaceJson {
		const figFaces: tFaceJson = {};
		for (const face in figs) {
			const figu = this.figureToPaxF(figs[face].mainList);
			figFaces[face] = figu;
		}
		return figFaces;
	}
	getAllPax(paramVal: tParamVal, geome0: tGeom, designName: string): string {
		const paxJson = {
			design: designName,
			params: paramVal,
			faces: this.getFigures(geome0.fig),
			volume: geome0.vol,
			subs: geome0.sub,
			log: geome0.logstr
		};
		const rStr = JSON.stringify(paxJson, null, 2);
		return rStr;
	}
}
function paxWrite(): PaxWrite {
	const rPaxWrite = new PaxWrite();
	return rPaxWrite;
}

export { paxWrite };
