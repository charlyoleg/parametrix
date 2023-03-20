<script context="module" lang="ts">
	function area(w: number, h: number) {
		return (w * h).toFixed(2);
	}

	export { area };
</script>

<script lang="ts">
	import Navigat from '$lib/Navigat.svelte';

	let width = 5;
	let height = 3;
</script>

<Navigat />

<h1>Rough</h1>
<article>An experimental page</article>

<section>
	<label>
		Width:
		<input type="number" bind:value={width} min="1" max="20" step="0.1" />
		<input type="range" bind:value={width} min="1" max="20" step="0.1" />
	</label>
	<label>
		Height:
		<input type="number" bind:value={height} min="1" max="20" step="0.1" />
		<input type="range" bind:value={height} min="1" max="20" step="0.1" />
	</label>
	<p>Surface: {area(width, height)} m2</p>
</section>

<style lang="scss">
	@use '$lib/style/colors.scss';

	h1 {
		margin: 1rem;
	}
	label {
		display: flex;
	}
	label,
	p {
		margin: 1em;
	}
	input {
		margin-left: 2em;
	}
</style>
