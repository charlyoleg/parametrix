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

// define set of menu
enum MenuSet {
	First = 0,
	Special
}

type menuType = Array<Array<string>>;
const menuMenu: Array<menuType> = [];
menuMenu.push(mIndex.concat(mFirst, mDocs, mAbout));
menuMenu.push(mIndex.concat(mSpecial, mAbout));

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

export type { menuType };
export { MenuSet, setMenu, getMenuMenu, indexMenu };
