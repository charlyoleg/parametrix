// menuList.ts

import { pageDef as circlesDef } from '$lib/design/circles';
import { pageDef as rectangleDef } from '$lib/design/rectangle';
import { pageDef as verifyPointDef } from '$lib/design/verify_point';
import { pageDef as verifyPoint2Def } from '$lib/design/verify_point_2';
import { pageDef as verifyLineDef } from '$lib/design/verify_line';
import type { tParamVal, tPageDef } from '$lib/design/aaParamGeom';
import type { tStorePVal } from '$lib/storePVal';
import { storePV } from '$lib/storePVal';
import { get, writable } from 'svelte/store';

type tAllPageDef = { [index: string]: tPageDef };
type tIcon = { [inedx: string]: string };
const designDefs: tAllPageDef = {
	circles: circlesDef,
	rectangle: rectangleDef,
	verify_point: verifyPointDef,
	verify_point_2: verifyPoint2Def,
	verify_line: verifyLineDef
};

/* Create the Header Menu and Index Menu */
const mIndex = ['index'];
const mDocs = ['readme'];
const mAbout = ['about'];
// to be updated when new pages are created
const mLabel = [
	['gears/circles'],
	['architecture/rectangle'],
	['dev/verify_point', 'dev/verify_point_2', 'dev/verify_line'],
	['docs/ui', 'docs/geom', 'docs/gears']
];
const mIcon: tIcon = {
	index: 'page_index.svg',
	circles: 'page_circles.svg',
	rectangle: 'page_rectangle.svg',
	verify_point: 'page_verify_point.svg',
	verify_point_2: 'page_verify_point.svg',
	verify_line: 'page_verify_line.svg',
	ui: 'page_ui.svg',
	geom: 'page_geom.svg',
	gears: 'page_gears.svg',
	readme: 'page_readme.svg',
	about: 'page_about.svg'
};
// end of section to be updated

/* initialization storePV */
const iniPV: tStorePVal = {};
for (const design of Object.keys(designDefs)) {
	const designParam: tParamVal = {};
	for (const param of designDefs[design].pDef.params) {
		designParam[param.name] = param.init;
	}
	iniPV[design] = designParam;
}
storePV.set(iniPV);
/* end of initialization storePV */

type tArrayLabel = Array<string>;
type tMenuElem = {
	path: string;
	label: string;
	svg: string;
};
type tMenu = Array<tMenuElem>;

function oneMenu(menuName: string): tMenuElem {
	const re = /^.*\//g;
	const labelString = menuName.replace(re, '');
	//const svgString = menuName.replace(re, '');
	//const mSvg = `page_${svgString}.svg`; // svg file name convention
	const mSvg = mIcon[labelString]; // configured svg filename (i.e. no convention)
	let mPath = `/${menuName}`;
	if (mPath === '/index') {
		mPath = '/';
	}
	const rMenu: tMenuElem = {
		path: mPath,
		label: labelString,
		svg: mSvg
	};
	return rMenu;
}
class genMenu {
	memMenu: Array<tArrayLabel> = [];
	constructor(firstMenu: tArrayLabel) {
		this.memMenu.push(firstMenu);
	}
	push(iMenu: tArrayLabel) {
		this.memMenu.push(iMenu);
	}
	makeMenuMenu() {
		const labelMenu: Array<tArrayLabel> = [];
		for (const [idx, iMenu] of this.memMenu.entries()) {
			if (idx === 0) {
				labelMenu.push(mIndex.concat(iMenu, mDocs, mAbout));
			} else {
				labelMenu.push(mIndex.concat(iMenu, mAbout));
			}
		}
		const rMenuMenu: Array<tMenu> = [];
		for (const arr1 of labelMenu) {
			rMenuMenu.push(arr1.map((menu: string) => oneMenu(menu)));
		}
		return rMenuMenu;
	}
	makeIndexMenu() {
		const labelMenu: Array<tArrayLabel> = [];
		labelMenu.push(mIndex);
		for (const iMenu of this.memMenu) {
			labelMenu.push(iMenu);
		}
		labelMenu.push(mDocs.concat(mAbout));
		const rIndexMenu: Array<tMenu> = [];
		for (const arr1 of labelMenu) {
			rIndexMenu.push(arr1.map((menu: string) => oneMenu(menu)));
		}
		return rIndexMenu;
	}
}

const oMenu = new genMenu(mLabel[0]);
for (let i = 1; i < mLabel.length; i++) {
	oMenu.push(mLabel[i]);
}

/* The Header Menu and Index Menu */
const menuMenu: Array<tMenu> = oMenu.makeMenuMenu();
const indexMenu: Array<tMenu> = oMenu.makeIndexMenu();

/* Managing thr Header Menu */
// the variable to store the active menu
const storeMenu = writable(0);
function setMenu(iMenu: number): void {
	storeMenu.set(iMenu);
}
function getMenuMenu(): tMenu {
	const rMenuMenu = menuMenu[get(storeMenu)];
	//for (const menu of rMenuMenu) {
	//	console.log(`dbg065: ${menu.path}`);
	//}
	return rMenuMenu;
}
function getLabelPath(iMenu: tArrayLabel): Array<string> {
	const rPath: Array<string> = [];
	for (const lItem of iMenu) {
		rPath.push(oneMenu(lItem).path);
	}
	return rPath;
}
function getMenuPath(iMenu: tMenu): Array<string> {
	const rPath: Array<string> = [];
	for (const lItem of iMenu) {
		rPath.push(lItem.path);
	}
	return rPath;
}
function findMenuMenu(iPath: string) {
	const univMenu = getLabelPath(mIndex.concat(mAbout)); // list of universal menus
	if (!univMenu.includes(iPath)) {
		for (const [lidx, lmenu] of menuMenu.entries()) {
			if (getMenuPath(lmenu).includes(iPath)) {
				setMenu(lidx);
				//console.log(`dbg080: ${lidx}`);
				break;
			}
		}
	}
	return getMenuMenu();
}
function checkEmptyPath(iPath: string): string {
	let rPath = iPath;
	if (rPath === '') {
		rPath = '/';
	}
	return rPath;
}

export type { tMenu };
export { checkEmptyPath, findMenuMenu, indexMenu, designDefs };
