<script lang="ts">
	let width: number = 5;
	let height: number = 3;
</script>

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
	<p>Surface: {(width * height).toFixed(2)} m2</p>
</section>

<style>
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
