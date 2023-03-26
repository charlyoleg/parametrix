<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function theClick(actionName: string) {
		dispatch('myevent', {
			action: actionName
		});
	}
</script>

<nav>
	<button on:click={() => theClick('zoomInit')}>Init</button>
	<button on:click={() => theClick('zoomIn')}>In</button>
	<button on:click={() => theClick('zoomOut')}>Out</button>
	<button on:click={() => theClick('moveLeft')}>Left</button>
	<button on:click={() => theClick('moveRight')}>Right</button>
	<button on:click={() => theClick('moveUp')}>Up</button>
	<button on:click={() => theClick('moveDown')}>Down</button>
</nav>

<style lang="scss">
	@use '$lib/style/colors.scss';

	nav > button {
		background-color: lightGreen;
	}
</style>
