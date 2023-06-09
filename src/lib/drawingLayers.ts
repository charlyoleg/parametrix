// drawingLayers.ts

import type { tLayers } from '$lib/geom/figure';
import { initLayers } from '$lib/geom/figure';
import { writable } from 'svelte/store';

const dLayers: tLayers = {
	points: writable(false),
	lines: writable(false),
	vectors: writable(false),
	main: writable(false),
	mainB: writable(false),
	second: writable(false),
	secondB: writable(false),
	dynamics: writable(false),
	refframe: writable(false)
};

export { dLayers };
