// prepare_pax.ts

// floating precision for pax export
function ff(ifloat: number): number {
	//const rFloat =  ifloat.toFixed(4);
	//const c10 = 10000;
	//const rFloat = Math.round(ifloat * c10) / c10;
	const rFloat = ifloat; // no rounding
	return rFloat;
}

type tPaxContourCircle = {
	circle: boolean;
	cx: number;
	cy: number;
	radius: number;
};

enum PSeg {
	eStart,
	eStroke,
	eArc
}
// for start and stroke
type tPaxSegSt = {
	typ: PSeg;
	px: number;
	py: number;
};
type tPaxSegArc = {
	typ: PSeg;
	px: number;
	py: number;
	radius: number;
	large: boolean;
	ccw: boolean;
};
type tPaxSeg = tPaxSegSt | tPaxSegArc;
type tPaxContourPath = {
	circle: boolean;
	seg: Array<tPaxSeg>;
};
type tPaxContour = tPaxContourPath | tPaxContourCircle;

function paxCircle(cx: number, cy: number, radius: number): tPaxContourCircle {
	const rPax: tPaxContourCircle = {
		circle: true,
		cx: ff(cx),
		cy: ff(cy),
		radius: ff(radius)
	};
	return rPax;
}

class PaxPath {
	seg: Array<tPaxSeg>;
	constructor() {
		this.seg = [];
	}
	addStart(px: number, py: number) {
		this.seg = [];
		const one: tPaxSegSt = {
			typ: PSeg.eStart,
			px: px,
			py: py
		};
		this.seg.push(one);
	}
	addStroke(px: number, py: number) {
		const one: tPaxSegSt = {
			typ: PSeg.eStroke,
			px: px,
			py: py
		};
		this.seg.push(one);
	}
	addArc(cx: number, cy: number, radius: number, large: boolean, ccw: boolean) {
		const one: tPaxSegArc = {
			typ: PSeg.eArc,
			px: cx,
			py: cy,
			radius: radius,
			large: large,
			ccw: ccw
		};
		this.seg.push(one);
	}
	toJson(): tPaxContourPath {
		const rPaxC: tPaxContourPath = {
			circle: false,
			seg: this.seg
		};
		return rPaxC;
	}
}
function paxPath(): PaxPath {
	const rPaxPath = new PaxPath();
	return rPaxPath;
}

export type { tPaxContourPath, tPaxContourCircle, tPaxContour };
export { paxPath, paxCircle };
