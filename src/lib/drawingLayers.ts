// drawingLayers.ts

//import type { tLayers } from '$lib/geom/geom';
import { initLayers } from '$lib/geom/geom';
import { writable } from 'svelte/store';

const dLayers = writable(initLayers());

export { dLayers };
