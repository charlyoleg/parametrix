// aaExportContent.ts

import type { tGeom, tParamVal } from '$lib/design/aaParamGeom';
import { figureToJson } from '$lib/geom/figure';
import * as zip from '@zip.js/zip.js';

function makePax(paramVal: tParamVal, geome0: tGeom): string {
	const paxJson = {
		params: paramVal,
		figure: figureToJson(geome0.fig.mainList),
		log: geome0.logstr
	};
	const rStr = JSON.stringify(paxJson, null, 2);
	return rStr;
}

async function makeZip(geome0: tGeom): Promise<Blob> {
	//const zipFileWriter = new zip.BlobWriter('application/zip');
	const zipFileWriter = new zip.BlobWriter();
	const helloWorldReader = new zip.TextReader('Hello world!');
	const logReader = new zip.TextReader(geome0.logstr);
	const zipWriter = new zip.ZipWriter(zipFileWriter);
	await zipWriter.add('hello.txt', helloWorldReader);
	await zipWriter.add('geom_log.txt', logReader);
	await zipWriter.close();
	const rFileContent = await zipFileWriter.getData();
	return rFileContent;
}

export { makePax, makeZip };
