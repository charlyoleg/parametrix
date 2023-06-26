// aaExportContent.ts

import type { tGeom, tParamVal } from './aaParamGeom';
import { figureToPaxF } from './figure';
import * as zip from '@zip.js/zip.js';

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

export { makePax, makeZip };
