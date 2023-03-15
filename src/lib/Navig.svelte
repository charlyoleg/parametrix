<script lang="ts">
	import type { menuType } from '$lib/menuList.js';
	import type { HTMLAttributes } from 'svelte/elements';
	interface $$Props extends HTMLAttributes<HTMLElement> {
		menuList: menuType;
	}

	import { base } from '$app/paths';

	export let menuList: menuType;
</script>

<nav>
	{#each menuList as menuItem}
		<a href="{base}/{menuItem[0]}">{menuItem[1]}</a>
	{/each}
</nav>

<style lang="scss">
	@use '$lib/style/colors.scss';

	nav {
		background-color: colors.$header-bg;
		padding: 0.3rem;
		//padding-top: 0.8rem;
	}
	nav > a {
		display: inline-block;
		color: colors.$menu;
		background-color: colors.$menu-back;
		text-decoration: none;
		padding-left: 0.3rem;
		padding-right: 0.3rem;
		border-style: solid;
		border-width: 0.2rem;
		border-radius: 0.6rem;
		border-color: colors.$menu-border;
		margin-top: 0.1rem;
	}
	nav > a:hover {
		color: colors.$menu-hover;
	}
</style>
