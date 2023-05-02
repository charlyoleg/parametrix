<script lang="ts">
	export let lc_points = true;
	export let lc_lines = true;
	export let lc_vectors = false;
	export let lc_main = true;
	export let lc_mainB = true;
	export let lc_second = true;
	export let lc_secondB = true;
	export let lc_dynamics = true;
	export let lc_frame = true;
</script>

<label><input type="checkbox" bind:checked={lc_points} />points</label>
<label><input type="checkbox" bind:checked={lc_lines} />lines</label>
<label><input type="checkbox" bind:checked={lc_vectors} />vectors</label>
<label><input type="checkbox" bind:checked={lc_main} />main part</label>
<label><input type="checkbox" bind:checked={lc_mainB} />main skeleton</label>
<label><input type="checkbox" bind:checked={lc_second} />second parts</label>
<label><input type="checkbox" bind:checked={lc_secondB} />second skeletons</label>
<label><input type="checkbox" bind:checked={lc_dynamics} />dynamics</label>
<label><input type="checkbox" bind:checked={lc_frame} />frame of reference</label>

<style lang="scss">
	@use '$lib/style/colors.scss';

	input {
		margin-left: 1rem;
	}
</style>
