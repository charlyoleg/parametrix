// drawingLayers.ts

//import type { tLayers } from '$lib/geom/figure';
import { initLayers } from '$lib/geom/figure';
import { writable } from 'svelte/store';

const dLayers = writable(initLayers());

export { dLayers };
