// menuList.ts

const mIndex = [['', 'index']];

const mFirst = [['circles', 'circles']];

const mSpecial = [['rough', 'rough']];

const mDocs = [
	['docs', 'docs'],
	['readme', 'readme']
];

const mAbout = [['about', 'about']];

const menuFirst = mIndex.concat(mFirst, mDocs, mAbout);
const menuSpecial = mIndex.concat(mSpecial, mAbout);

export { menuFirst, menuSpecial };
