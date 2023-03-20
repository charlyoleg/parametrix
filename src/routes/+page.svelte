<script lang="ts">
	import { indexMenu } from '$lib/menuList';
	import Navigat from '$lib/Navigat.svelte';
	import { base } from '$app/paths';
</script>

<Navigat />
<h1>Parametrix index</h1>
<article>
	{#each indexMenu as menuLi, listIdx}
		<div class="separation" />
		<ul>
			{#each menuLi as menuItem, itemIdx}
				<li>
					<img
						class:alter={(listIdx + itemIdx) % 2 === 1}
						src="{base}/{menuItem[2]}"
						alt={menuItem[1]}
					/>
					<a href="{base}/{menuItem[0]}">{listIdx + 1}.{itemIdx + 1} - {menuItem[1]}</a>
				</li>
			{/each}
		</ul>
		<div class="separation sepaStop" />
	{/each}
</article>

<style>
	h1 {
		margin: 1rem;
	}
	article {
		margin: 0rem;
		column-count: 1;
		/*column-width: 16rem;*/
		column-gap: 2rem;
	}
	article > div.separation {
		width: 13rem;
		height: 0.5rem;
		border-radius: 0.3rem;
		margin: 1rem;
		margin-left: 1rem;
		background-color: darkBlue;
	}
	article > div.separation.sepaStop {
		background-color: lightBlue;
	}
	article > ul {
		list-style-type: none;
		margin: 0;
		padding: 0;
	}
	article > ul > li > img {
		margin: -1rem;
		margin-left: 1rem;
		margin-right: 3rem;
		width: 1.5rem;
		position: relative;
		bottom: 0.5rem;
	}
	article > ul > li > img.alter {
		margin-left: 3.5rem;
		margin-right: 0.5rem;
	}
	article > ul > li > a {
		text-decoration: none;
		margin-left: 0.1rem;
	}
</style>
