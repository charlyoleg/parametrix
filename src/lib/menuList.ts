// menuList.ts

import { pageDef as circlesDef } from '$lib/design/circles';
import type { tPageDef } from '$lib/design/aaParamGeom';
import { get, writable } from 'svelte/store';

type tAllPageDef = { [index: string]: tPageDef };
const designDefs: tAllPageDef = {
	circles: circlesDef,
	rough: circlesDef
};

type menuType = Array<{
	path: string;
	label: string;
	svg: string;
}>;

// define section of menu
const mIndex = [{ path: '/', label: 'index', svg: 'page_index.svg' }];
const mDocs = [
	{ path: '/docs', label: 'docs', svg: 'page_docs.svg' },
	{ path: '/readme', label: 'readme', svg: 'page_readme.svg' }
];
const mAbout = [{ path: '/about', label: 'about', svg: 'page_about.svg' }];

class genMenu {
	memMenu: Array<menuType> = [];
	constructor(firstMenu: menuType) {
		this.memMenu.push(firstMenu);
	}
	push(iMenu: menuType) {
		this.memMenu.push(iMenu);
	}
	makeMenuMenu() {
		const rMenuMenu: Array<menuType> = [];
		for (const [idx, iMenu] of this.memMenu.entries()) {
			if (idx === 0) {
				rMenuMenu.push(mIndex.concat(iMenu, mDocs, mAbout));
			} else {
				rMenuMenu.push(mIndex.concat(iMenu, mAbout));
			}
		}
		return rMenuMenu;
	}
	makeIndexMenu() {
		const rIndexMenu: Array<menuType> = [];
		rIndexMenu.push(mIndex);
		for (const iMenu of this.memMenu) {
			rIndexMenu.push(iMenu);
		}
		rIndexMenu.push(mDocs.concat(mAbout));
		return rIndexMenu;
	}
}

// to be updated when new pages are created
const oMenu = new genMenu([{ path: '/circles', label: 'circles', svg: 'page_circle.svg' }]);
oMenu.push([{ path: '/rough', label: 'rough', svg: 'page_rough.svg' }]);
// end of section to be updated

const menuMenu: Array<menuType> = oMenu.makeMenuMenu();
const indexMenu: Array<menuType> = oMenu.makeIndexMenu();
// the variable to store the active menu
const storeMenu = writable(0);
function setMenu(iMenu: number): void {
	storeMenu.set(iMenu);
}
function getMenuMenu(): menuType {
	const rMenuMenu = menuMenu[get(storeMenu)];
	//for (const menu of rMenuMenu) {
	//	console.log(`dbg065: ${menu.path}`);
	//}
	return rMenuMenu;
}
function extractArr(iMenu: menuType): Array<string> {
	const rPath: Array<string> = [];
	for (const lItem of iMenu) {
		rPath.push(lItem.path);
	}
	return rPath;
}
function findMenuMenu(iPath: string) {
	const univMenu = extractArr(mIndex.concat(mAbout)); // list of universal menus
	if (!univMenu.includes(iPath)) {
		for (const [lidx, lmenu] of menuMenu.entries()) {
			if (extractArr(lmenu).includes(iPath)) {
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

export type { menuType };
export { checkEmptyPath, findMenuMenu, indexMenu, designDefs };
