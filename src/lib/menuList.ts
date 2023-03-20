// menuList.ts

import { get, writable } from 'svelte/store';

// define section of menu
const mIndex = [['', 'index', 'page_index.png']];
const mFirst = [['circles', 'circles', 'page_circle.png']];
const mSpecial = [['rough', 'rough', 'page_rough.png']];
const mDocs = [
	['docs', 'docs', 'page_docs.png'],
	['readme', 'readme', 'page_readme.png']
];
const mAbout = [['about', 'about', 'page_about.png']];

type menuType = Array<Array<string>>;
const menuMenu: Array<menuType> = [];
function makeMenu(iMenu: menuType): menuType {
	return mIndex.concat(iMenu, mAbout);
}
// define set of menu
enum MenuSet {
	First = 0,
	Special
}
menuMenu.push(mIndex.concat(mFirst, mDocs, mAbout));
menuMenu.push(makeMenu(mSpecial));

const indexMenu: Array<menuType> = [];
indexMenu.push(mIndex);
indexMenu.push(mFirst);
indexMenu.push(mSpecial);
indexMenu.push(mDocs.concat(mAbout));

// the variable to store the active menu
const storeMenu = writable(MenuSet.First);

function setMenu(iMenu: MenuSet): void {
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
				setMenu(lidx as MenuSet);
				break;
			}
		}
	}
	return getMenuMenu();
}

export type { menuType };
export { findMenuMenu, indexMenu };
