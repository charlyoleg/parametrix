// svg.ts

// floating precision for svg export
function ff(ifloat: number): string {
	return ifloat.toFixed(4);
}

function svgCircleString(cx: number, cy: number, radius: number) {
	const rSvg = `<circle cx=${ff(cx)} cy=${ff(cy)} r=${ff(
		radius
	)} stroke="black" stroke-width="1" fill="none" />`;
	return rSvg;
}

class SvgPath {
	pathD: string;
	constructor() {
		this.pathD = '';
	}
	addStart(px: number, py: number) {
		this.pathD = `M ${ff(px)} ${ff(py)}`;
	}
	addStroke(px: number, py: number) {
		this.pathD += ` L ${ff(px)} ${ff(py)}`;
	}
	addArc(px: number, py: number, radius: number, large: boolean, ccw: boolean) {
		const aRadius = ff(radius);
		const aLarge = large ? 1 : 0;
		const aCcw = ccw ? 1 : 0;
		this.pathD += ` A ${aRadius} ${aRadius} 0 ${aLarge} ${aCcw} ${ff(px)} ${ff(py)}`;
	}
	stringify(): string {
		const rSvg = `<path d="${this.pathD} Z" stroke="black" stroke-width="1" fill="none" />`;
		return rSvg;
	}
}
function svgPath(): SvgPath {
	const rSvgPath = new SvgPath();
	return rSvgPath;
}

class SvgWrite {
	svgStr: string;
	constructor(xMin: number, xWidth: number, yMin: number, yHeight: number) {
		const viewBoxValues = `${xMin} ${yMin} ${xWidth} ${yHeight}`;
		this.svgStr = `<svg width="${xWidth}" height="${yHeight}" viewBox="${viewBoxValues}" xmlns="http://www.w3.org/2000/svg">`;
	}
	addSvgString(svgString: string) {
		this.svgStr += svgString;
	}
	close() {
		this.svgStr += '</svg>';
	}
	stringify(): string {
		this.close();
		return this.svgStr;
	}
}
function svgWriter(xMin: number, xWidth: number, yMin: number, yHeight: number): SvgWrite {
	const rSvgWrite = new SvgWrite(xMin, xWidth, yMin, yHeight);
	return rSvgWrite;
}

export { svgWriter, svgPath, svgCircleString };
