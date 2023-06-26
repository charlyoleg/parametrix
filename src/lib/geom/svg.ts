// svg.ts

// floating precision for svg export
function ff(ifloat: number): string {
	return ifloat.toFixed(4);
}

function svgCircleString(cx: number, cy: number, radius: number) {
	const rSvg = `<circle cx="${ff(cx)}" cy="${ff(cy)}" r="${ff(
		radius
	)}" stroke="black" stroke-width="1" fill="none" />`;
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

class SvgWriter {
	svgStr: string;
	payloadStr: string;
	groupActive: boolean;
	constructor() {
		this.payloadStr = '';
		this.svgStr = '';
		this.groupActive = false;
	}
	addHeader(xMin: number, xWidth: number, yMin: number, yHeight: number) {
		const viewBoxValues = `${xMin} ${yMin} ${xWidth} ${yHeight}`;
		this.svgStr = `<svg width="${xWidth}" height="${yHeight}" viewBox="${viewBoxValues}" xmlns="http://www.w3.org/2000/svg">`;
	}
	addSvgString(svgString: string) {
		this.payloadStr += svgString;
	}
	addGroup(groupId: string) {
		if (this.groupActive) {
			throw `err321: group must be closed before opening a new one`;
		}
		this.groupActive = true;
		this.payloadStr += `<g id="${groupId}">`;
	}
	closeGroup() {
		if (!this.groupActive) {
			throw `err331: group is not active so can not be closed`;
		}
		this.groupActive = false;
		this.payloadStr += `</g>`;
	}
	closeSvg() {
		if (this.svgStr === '') {
			throw `err301: no header set for the svg`;
		}
		if (this.groupActive) {
			throw `err311: group is not closed`;
		}
		this.svgStr += this.payloadStr;
		this.svgStr += '</svg>';
	}
	stringify(): string {
		this.closeSvg();
		return this.svgStr;
	}
}
function svgWriter(): SvgWriter {
	const rSvgWrite = new SvgWriter();
	return rSvgWrite;
}

export type { SvgWriter };
export { svgWriter, svgPath, svgCircleString };
