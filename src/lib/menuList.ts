// menuList.ts

import { get, writable } from 'svelte/store';

// define section of menu
const mIndex = [['', 'index']];
const mFirst = [['circles', 'circles']];
const mSpecial = [['rough', 'rough']];
const mDocs = [
	['docs', 'docs'],
	['readme', 'readme']
];
const mAbout = [['about', 'about']];

// define set of menu
enum MenuSet {
	First = 0,
	Special
}
type menuType = Array<Array<string>>;
const menuMenu: Array<menuType> = [];
menuMenu.push(mIndex.concat(mFirst, mDocs, mAbout));
menuMenu.push(mIndex.concat(mSpecial, mAbout));

// the variable to store the active menu
const storeMenu = writable(MenuSet.First);

function setMenu(iMenu: MenuSet): void {
	storeMenu.set(iMenu);
}
function getMenuMenu(): menuType {
	return menuMenu[get(storeMenu)];
}

export type { menuType };
export { MenuSet, setMenu, getMenuMenu };
