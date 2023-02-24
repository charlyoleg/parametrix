<script lang="ts">
	import { base } from '$app/paths';
	import MyHeader from './MyHeader.svelte';
	import MyFooter from './MyFooter.svelte';
</script>

<MyHeader />
<nav>
	<a href="{base}/">Index</a>
	<a href="{base}/rough">Rough</a>
	<a href="{base}/circles">Circles</a>
	<a href="{base}/about">About</a>
</nav>
<main>
	<slot />
</main>
<MyFooter />

<style lang="scss">
	@use '$lib/style/colors.scss';

	:global(body) {
		font-family: 'Lucida Console', 'Monaco', 'Verdana';
		margin: 0;
	}
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
	main {
		background-color: colors.$main-bg;
		min-height: 70vh;
	}
</style>
