// exportFile.ts

import type { tGeomFunc, tParamVal } from '$lib/design/aaParamGeom';
import { figureToSvg, figureToDxf, figureToJson } from '$lib/geom/figure';
import * as zip from '@zip.js/zip.js';

enum EFormat {
	eSVG,
	eDXF,
	ePAX,
	eZIP
}

function fileTextContent(geom: tGeomFunc, paramVal: tParamVal, exportFormat: EFormat): string {
	const geome0 = geom(0, paramVal);
	let rFileContent = '';
	if (!geome0.calcErr) {
		if (exportFormat === EFormat.eSVG) {
			rFileContent = figureToSvg(geome0.fig.mainList);
		} else if (exportFormat === EFormat.eDXF) {
			rFileContent = figureToDxf(geome0.fig.mainList);
		} else if (exportFormat === EFormat.ePAX) {
			const paxJson = {
				params: paramVal,
				figure: figureToJson(geome0.fig.mainList),
				log: geome0.logstr
			};
			rFileContent = JSON.stringify(paxJson, null, 2);
		} else {
			console.log(`err912: unknown exportFormat ${exportFormat}`);
		}
	} else {
		console.log('err931: error by calling geome ${geome0.calcErr}');
	}
	return rFileContent;
}

async function fileBinContent(
	geom: tGeomFunc,
	tSim: number,
	paramVal: tParamVal,
	exportFormat: EFormat
): Promise<Blob> {
	const geome0 = geom(0, paramVal);
	const geome1 = geom(tSim, paramVal);
	let rFileContent = new Blob();
	if (!geome0.calcErr && !geome1.calcErr) {
		if (exportFormat === EFormat.eZIP) {
			//const zipFileWriter = new zip.BlobWriter('application/zip');
			const zipFileWriter = new zip.BlobWriter();
			const helloWorldReader = new zip.TextReader('Hello world!');
			const logReader = new zip.TextReader(geome0.logstr);
			const zipWriter = new zip.ZipWriter(zipFileWriter);
			await zipWriter.add('hello.txt', helloWorldReader);
			await zipWriter.add('geom_log.txt', logReader);
			await zipWriter.close();
			rFileContent = await zipFileWriter.getData();
		} else {
			console.log(`err913: unknown exportFormat ${exportFormat}`);
		}
	} else {
		console.log('err932: error by calling geome ${geome0.calcErr} ${geome1.calcErr}');
	}
	return rFileContent;
}

function fileMime(exportFormat: EFormat): string {
	let rMime = '';
	if (exportFormat === EFormat.eSVG) {
		rMime = 'image/svg+xml';
	} else if (exportFormat === EFormat.eDXF) {
		rMime = 'application/dxf';
	} else if (exportFormat === EFormat.ePAX) {
		rMime = 'application/json';
		//rMime = 'text/plain';
	} else if (exportFormat === EFormat.eZIP) {
		rMime = 'application/zip';
	} else {
		console.log(`err903: unknown exportFormat ${exportFormat}`);
	}
	return rMime;
}

function fileSuffix(exportFormat: EFormat): string {
	let rSuffix = '';
	if (exportFormat === EFormat.eSVG) {
		rSuffix = 'svg';
	} else if (exportFormat === EFormat.eDXF) {
		rSuffix = 'dxf';
	} else if (exportFormat === EFormat.ePAX) {
		rSuffix = 'pax.json';
	} else if (exportFormat === EFormat.eZIP) {
		rSuffix = 'zip';
	} else {
		console.log(`err904: unknown exportFormat ${exportFormat}`);
	}
	return rSuffix;
}

function fileBin(exportFormat: EFormat): boolean {
	let rBin = false;
	if (exportFormat === EFormat.eZIP) {
		rBin = true;
	}
	return rBin;
}

export { EFormat, fileBinContent, fileTextContent, fileMime, fileSuffix, fileBin };
