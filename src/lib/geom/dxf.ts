// dxf.ts

class DxfWrite {
	dxfStr: string;
	constructor() {
		this.dxfStr = '0\nSECTION\n2\nENTITIES\n';
	}
	addCircle(cx: number, cy: number, radius: number) {
		this.dxfStr += '0\nCIRCLE\n8\nPARAMETRIX\n';
		this.dxfStr += `10\n${cx}\n20\n${cy}\n40\n${radius}\n`;
	}
	addLine(p1x: number, p1y: number, p2x: number, p2y: number) {
		this.dxfStr += '0\nLINE\n8\nPARAMETRIX\n';
		this.dxfStr += `10\n${p1x}\n20\n${p1y}\n11\n${p2x}\n21\n${p2y}\n`;
	}
	addArc(cx: number, cy: number, radius: number, a1: number, a2: number) {
		this.dxfStr += '0\nARC\n8\nPARAMETRIX\n';
		this.dxfStr += `10\n${cx}\n20\n${cy}\n40\n${radius}\n50\n${a1}\n51\n${a2}\n`;
	}
	close() {
		this.dxfStr += '0\nENDSEC\n0\nEOF\n';
	}
	stringify(): string {
		this.close();
		return this.dxfStr;
	}
}

function dxfWriter() {
	const rDxfWrite = new DxfWrite();
	return rDxfWrite;
}

export { dxfWriter };
