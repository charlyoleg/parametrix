<script lang="ts">
	import { dLayers } from '$lib/drawingLayers';
</script>

<label><input type="checkbox" bind:checked={$dLayers.main} />main part</label>
<label><input type="checkbox" bind:checked={$dLayers.mainB} />main skeleton</label>
<label><input type="checkbox" bind:checked={$dLayers.second} />second parts</label>
<label><input type="checkbox" bind:checked={$dLayers.secondB} />second skeletons</label>
<label><input type="checkbox" bind:checked={$dLayers.dynamics} />dynamics</label>
<label><input type="checkbox" bind:checked={$dLayers.refframe} />frame of reference</label>
<label><input type="checkbox" bind:checked={$dLayers.points} />points</label>
<label><input type="checkbox" bind:checked={$dLayers.lines} />lines</label>
<label><input type="checkbox" bind:checked={$dLayers.vectors} />vectors</label>

<style lang="scss">
	@use '$lib/style/colors.scss';

	input {
		margin-left: 1rem;
	}
</style>
