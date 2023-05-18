<script lang="ts">
	export let lc_points = false;
	export let lc_lines = false;
	export let lc_vectors = false;
	export let lc_main = true;
	export let lc_mainB = false;
	export let lc_second = true;
	export let lc_secondB = false;
	export let lc_dynamics = true;
	export let lc_frame = false;
</script>

<label><input type="checkbox" bind:checked={lc_main} />main part</label>
<label><input type="checkbox" bind:checked={lc_mainB} />main skeleton</label>
<label><input type="checkbox" bind:checked={lc_second} />second parts</label>
<label><input type="checkbox" bind:checked={lc_secondB} />second skeletons</label>
<label><input type="checkbox" bind:checked={lc_dynamics} />dynamics</label>
<label><input type="checkbox" bind:checked={lc_frame} />frame of reference</label>
<label><input type="checkbox" bind:checked={lc_points} />points</label>
<label><input type="checkbox" bind:checked={lc_lines} />lines</label>
<label><input type="checkbox" bind:checked={lc_vectors} />vectors</label>

<style lang="scss">
	@use '$lib/style/colors.scss';

	input {
		margin-left: 1rem;
	}
</style>
