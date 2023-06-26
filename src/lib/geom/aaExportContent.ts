// aaExportContent.ts

import type { tGeom, tParamVal } from './aaParamGeom';
import { Point, point, pointMinMax } from './point';
import type { tContour } from './contour';
import type { SvgWriter } from './svg';
import { svgWriter } from './svg';
import { dxfWriter } from './dxf';
import type { tPaxContour } from './pax';
import { paxWriter } from './pax';
import * as zip from '@zip.js/zip.js';

// SVG
class MinMaxPoint {
	xMin: number;
	xMax: number;
	yMin: number;
	yMax: number;
	firstDone: boolean;
	constructor() {
		this.firstDone = false;
		this.xMin = 0;
		this.xMax = 0;
		this.yMin = 0;
		this.yMax = 0;
	}
	addAContour(aCtr: Array<tContour>) {
		const pts: Array<Point> = [];
		if (this.firstDone) {
			pts.push(point(this.xMin, this.yMin));
			pts.push(point(this.xMax, this.yMax));
		}
		for (const ctr of aCtr) {
			pts.push(...ctr.generatePoints());
		}
		const [Xmin, Xmax, Ymin, Ymax] = pointMinMax(pts);
		this.xMin = Xmin;
		this.xMax = Xmax;
		this.yMin = Ymin;
		this.yMax = Ymax;
	}
	getViewBox() {
		const Xdelta = Math.round((this.xMax - this.xMin) * 1.1) + 10;
		const Ydelta = Math.round((this.yMax - this.yMin) * 1.1) + 10;
		const Xmin2 = Math.round(this.xMin - Xdelta * 0.05);
		const Ymin2 = Math.round(this.yMin - Ydelta * 0.05);
		return [Xmin2, Xdelta, Ymin2, Ydelta];
	}
}

class SvgWriter2 {
	minMax: MinMaxPoint;
	svg: SvgWriter;
	constructor() {
		this.minMax = new MinMaxPoint();
		this.svg = svgWriter();
	}
	addAContour(aCtr: Array<tContour>, groupId = '') {
		this.minMax.addAContour(aCtr);
		if (groupId !== '') {
			this.svg.addGroup(groupId);
		}
		for (const ctr of aCtr) {
			this.svg.addSvgString(ctr.toSvg());
		}
		if (groupId !== '') {
			this.svg.closeGroup();
		}
	}
	stringify() {
		const [Xmin2, Xdelta, Ymin2, Ydelta] = this.minMax.getViewBox();
		this.svg.addHeader(Xmin2, Xdelta, Ymin2, Ydelta);
		return this.svg.stringify();
	}
}
function svgWriter2(): SvgWriter2 {
	const rSvgWriter2 = new SvgWriter2();
	return rSvgWriter2;
}
function figureToSvg(aCtr: Array<tContour>): string {
	const sw2 = svgWriter2();
	sw2.addAContour(aCtr);
	return sw2.stringify();
}

// DXF
function figureToDxf(aCtr: Array<tContour>): string {
	const dxf = dxfWriter();
	//const firstDxfLayer = dxf.addLayer('first');
	for (const ctr of aCtr) {
		if (ctr.circle) {
			const seg = ctr.toDxfSeg()[0];
			dxf.addCircle(seg.p1x, seg.p1y, seg.radius);
		} else {
			for (const seg of ctr.toDxfSeg()) {
				if (seg.arc) {
					dxf.addArc(seg.p1x, seg.p1y, seg.radius, seg.a1, seg.a2);
				} else {
					dxf.addLine(seg.p1x, seg.p1y, seg.p2x, seg.p2y);
				}
			}
		}
	}
	const rDxf = dxf.stringify();
	return rDxf;
}

// PAX
function figureToPaxF(aCtr: Array<tContour>): Array<tPaxContour> {
	const pax = paxWriter();
	for (const ctr of aCtr) {
		pax.addContour(ctr.toPax());
	}
	const rPaxF = pax.getFigure();
	return rPaxF;
}

function makePax(paramVal: tParamVal, geome0: tGeom, designName: string): string {
	const paxJson = {
		design: designName,
		params: paramVal,
		figure: figureToPaxF(geome0.fig.mainList),
		log: geome0.logstr
	};
	const rStr = JSON.stringify(paxJson, null, 2);
	return rStr;
}

// ZIP
async function makeZip(
	paramVal: tParamVal,
	geome0: tGeom,
	tSim: number,
	geome1: tGeom,
	designName: string
): Promise<Blob> {
	// zip writer preparation
	const zipFileWriter = new zip.BlobWriter('application/zip');
	const zipWriter = new zip.ZipWriter(zipFileWriter);
	// zip payload
	const zParam = new zip.TextReader(JSON.stringify(paramVal, null, 2));
	await zipWriter.add(`param_${designName}.json`, zParam);
	const zLog0 = new zip.TextReader(geome0.logstr);
	await zipWriter.add(`geom_${designName}_log.txt`, zLog0);
	const zLog1 = new zip.TextReader(geome1.logstr);
	await zipWriter.add(`geom_${designName}_t${tSim}_log.txt`, zLog1);
	const zPax = new zip.TextReader(makePax(paramVal, geome0, designName));
	await zipWriter.add(`${designName}.pax.json`, zPax);
	const svgOne = new zip.TextReader(figureToSvg(geome0.fig.mainList));
	await zipWriter.add(`face_${designName}_one.svg`, svgOne);
	const dxfOne = new zip.TextReader(figureToDxf(geome0.fig.mainList));
	await zipWriter.add(`face_${designName}_one.dxf`, dxfOne);
	const sw2 = svgWriter2();
	sw2.addAContour(geome0.fig.mainList, 'main');
	sw2.addAContour(geome0.fig.mainBList, 'mainB');
	sw2.addAContour(geome0.fig.secondList, 'second');
	sw2.addAContour(geome0.fig.secondBList, 'secondB');
	sw2.addAContour(geome0.fig.dynamicsList, 'dynamics');
	const svgOneDeco = new zip.TextReader(sw2.stringify());
	await zipWriter.add(`face_${designName}_one_deco.svg`, svgOneDeco);
	// zip writer finalization
	await zipWriter.close();
	const rFileContent = await zipFileWriter.getData();
	return rFileContent;
}

export { figureToSvg, figureToDxf, makePax, makeZip };
