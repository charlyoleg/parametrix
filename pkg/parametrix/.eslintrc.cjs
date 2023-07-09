module.exports = {
	root: true,
	extends: [
		'eslint:recommended',
		'plugin:svelte/recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier'
	],
	plugins: ['@typescript-eslint'],
	ignorePatterns: ['*.cjs'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: './tsconfig.json',
		extraFileExtensions: ['.svelte'],
		sourceType: 'module',
		ecmaVersion: 2020
	},
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			// Parse the `<script>` in `.svelte` as TypeScript by adding the following configuration.
			parserOptions: {
				parser: '@typescript-eslint/parser'
			}
		}
	],
	env: {
		browser: true,
		es2017: true,
		node: true
	}
};
