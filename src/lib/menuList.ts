// menuList.ts

import { get, writable } from 'svelte/store';

// define section of menu
const mIndex = [['', 'index', 'page_index.svg']];
const mDocs = [
	['docs', 'docs', 'page_docs.svg'],
	['readme', 'readme', 'page_readme.svg']
];
const mAbout = [['about', 'about', 'page_about.svg']];

type menuType = Array<Array<string>>;
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
const oMenu = new genMenu([['circles', 'circles', 'page_circle.svg']]);
oMenu.push([['rough', 'rough', 'page_rough.svg']]);
// end of section to be updated

const menuMenu: Array<menuType> = oMenu.makeMenuMenu();
const indexMenu: Array<menuType> = oMenu.makeIndexMenu();
// the variable to store the active menu
const storeMenu = writable(0);
function setMenu(iMenu: number): void {
	storeMenu.set(iMenu);
}
function getMenuMenu(): menuType {
	return menuMenu[get(storeMenu)];
}
function extractArr(iMenu: menuType): Array<string> {
	const rPath: Array<string> = [];
	for (const lItem of iMenu) {
		rPath.push(lItem[0]);
	}
	return rPath;
}
function findMenuMenu(iPath: string) {
	const univMenu = extractArr(mIndex.concat(mAbout)); // list of universal menus
	if (!univMenu.includes(iPath)) {
		for (const [lidx, lmenu] of menuMenu.entries()) {
			if (extractArr(lmenu).includes(iPath)) {
				setMenu(lidx);
				break;
			}
		}
	}
	return getMenuMenu();
}

export type { menuType };
export { findMenuMenu, indexMenu };
