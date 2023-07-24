// write_openscad.ts

import type { tContour } from './contour';
import type { tFaces } from './figure';
import type { tOpenscadSeg } from './prepare_openscad';

// floating precision for OpenScad export
function ff(ifloat: number): string {
	return ifloat.toFixed(4);
}

class OpenscadWriteFigure {
	pts: Array<string>;
	ptIdx: Array<string>;
	idx: number;
	constructor() {
		this.pts = [];
		this.ptIdx = [];
		this.idx = 0;
	}
	addContour(ictr: tOpenscadSeg) {
		const pts2: Array<string> = [];
		const ptIdx2: Array<string> = [];
		for (const pt of ictr) {
			const [px, py] = pt;
			pts2.push(`[ ${ff(px)}, ${ff(py)} ]`);
			ptIdx2.push(` ${this.idx}`);
			this.idx += 1;
		}
		const ptStr = `[ ${pts2.join(',')} ]`;
		const ptIdxStr = `[ ${ptIdx2.join(',')} ]`;
		this.pts.push(ptStr);
		this.ptIdx.push(ptIdxStr);
	}
	getFigure(faceId: string): string {
		let rStr = '';
		const aList: Array<string> = [];
		const bList: Array<string> = [];
		for (const idx of this.pts.keys()) {
			const aId = `ca_${faceId}_${idx}`;
			const bId = `cb_${faceId}_${idx}`;
			rStr += `${aId} = ${this.pts[idx]};\n`;
			rStr += `${bId} = ${this.ptIdx[idx]};\n`;
			aList.push(aId);
			bList.push(bId);
		}
		const aListStr = aList.join(', ');
		const bListStr = bList.join(', ');
		rStr += `a_${faceId} = concat(${aListStr});\n`;
		rStr += `b_${faceId} = [${bListStr}];\n`;
		return rStr;
	}
}

class OpenscadWrite {
	//constructor() {}
	getHeader(): string {
		const rStr = '// Generated by Parametrix\n';
		return rStr;
	}
	getOneFigure(aCtr: Array<tContour>, faceId: string): string {
		const oscadWF = new OpenscadWriteFigure();
		for (const ctr of aCtr) {
			oscadWF.addContour(ctr.toOpenscadSeg());
		}
		const rOscadF = oscadWF.getFigure(faceId);
		return rOscadF;
	}
	getAllFigures(figs: tFaces, designName: string): string {
		let rStr = '';
		for (const face in figs) {
			const figu = this.getOneFigure(figs[face].mainList, `${designName}_${face}`);
			rStr += figu;
		}
		return rStr;
	}
	getVolume(designName: string): string {
		const faceId1 = 'teethProfile';
		const faceId2 = 'axisProfile';
		const rStr = `
module subpax_${designName}_${faceId1} () {
	translate([0, 0, -300])
	linear_extrude(height = 600) polygon(a_${designName}_${faceId1}, b_${designName}_${faceId1});
}
module subpax_${designName}_${faceId2} () {
	rotate_extrude() polygon(a_${designName}_${faceId2}, b_${designName}_${faceId2});
}
module pax_${designName} () {
	intersection () {
		subpax_${designName}_${faceId1}();
		subpax_${designName}_${faceId2}();
	}
}
`;
		return rStr;
	}
	getFooter(designName: string): string {
		const rStr = `
pax_${designName}();
`;
		return rStr;
	}
	getExportFile(figs: tFaces, designName: string) {
		let rStr = this.getHeader();
		rStr += this.getAllFigures(figs, designName);
		rStr += this.getVolume(designName);
		rStr += this.getFooter(designName);
		return rStr;
	}
}
function oscadWrite() {
	const rOscadWrite = new OpenscadWrite();
	return rOscadWrite;
}

export { oscadWrite };
