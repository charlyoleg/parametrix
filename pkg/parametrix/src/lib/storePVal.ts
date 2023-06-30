// storePVal.ts

import type { tParamVal } from '$lib/geom/geom';
import { writable } from 'svelte/store';

type tStorePVal = { [index: string]: tParamVal };
const storePV = writable({} as tStorePVal);

export type { tStorePVal };
export { storePV };
