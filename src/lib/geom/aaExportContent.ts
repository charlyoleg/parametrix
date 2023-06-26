// aaExportContent.ts

import type { tGeom, tParamVal } from './aaParamGeom';
import { Point, pointMinMax } from './point';
import type { tContour } from './contour';
import { svgWriter } from './svg';
import { dxfWriter } from './dxf';
import type { tPaxContour } from './pax';
import { paxWriter } from './pax';
import * as zip from '@zip.js/zip.js';

function figureToSvg(aCtr: Array<tContour>): string {
	const pts: Array<Point> = [];
	for (const ctr of aCtr) {
		pts.push(...ctr.generatePoints());
	}
	const [Xmin, Xmax, Ymin, Ymax] = pointMinMax(pts);
	const Xdelta = Math.round((Xmax - Xmin) * 1.1) + 10;
	const Ydelta = Math.round((Ymax - Ymin) * 1.1) + 10;
	const Xmin2 = Math.round(Xmin - Xdelta * 0.05);
	const Ymin2 = Math.round(Ymin - Ydelta * 0.05);
	const svg = svgWriter(Xmin2, Xdelta, Ymin2, Ydelta);
	for (const ctr of aCtr) {
		svg.addSvgString(ctr.toSvg());
	}
	const rSvg = svg.stringify();
	return rSvg;
}

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
	const zPax = new zip.TextReader(makePax(paramVal, geome0, designName));
	await zipWriter.add(`${designName}.pax.json`, zPax);
	const zLog1 = new zip.TextReader(geome1.logstr);
	await zipWriter.add(`geom_${designName}_t${tSim}_log.txt`, zLog1);
	// zip writer finalization
	await zipWriter.close();
	const rFileContent = await zipFileWriter.getData();
	return rFileContent;
}

export { figureToSvg, figureToDxf, makePax, makeZip };
