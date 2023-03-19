<script lang="ts">
	import { indexMenu } from '$lib/menuList';
	import Navigat from '$lib/Navigat.svelte';
	import { base } from '$app/paths';
</script>

<Navigat />
<h1>Parametrix index</h1>
{#each indexMenu as menuLi, listIdx}
	<div class="separation" />
	<ul>
		{#each menuLi as menuItem, itemIdx}
			<li>
				<img class:invis={itemIdx % 2 === 1} src="{base}/{menuItem[2]}" alt={menuItem[1]} />
				<a href="{base}/{menuItem[0]}">{listIdx + 1}.{itemIdx + 1} - {menuItem[1]}</a>
				<img class:invis={itemIdx % 2 === 0} src="{base}/{menuItem[2]}" alt={menuItem[1]} />
			</li>
		{/each}
	</ul>
	<div class="separation sepaStop" />
{/each}

<style>
	h1 {
		margin: 0;
	}
	div.separation {
		width: 5rem;
		height: 0.5rem;
		border-radius: 0.3rem;
		margin-left: 4rem;
		background-color: darkBlue;
	}
	div.separation.sepaStop {
		background-color: lightBlue;
	}
	ul {
		list-style-type: none;
		margin: 0;
		padding: 0;
	}
	ul > li > img {
		width: 1.5rem;
		position: relative;
		bottom: -0.5rem;
	}
	ul > li > img.invis {
		display: none;
	}
	ul > li > a {
		text-decoration: none;
	}
</style>
