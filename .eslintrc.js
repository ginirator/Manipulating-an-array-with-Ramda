module.exports = {
	env: {
		commonjs: true,
		es6: true,
		node: true,
		browser: true
	},
	extends: [
		'eslint:recommended'
	],
	parserOptions: {
		ecmaVersion: 13
	},
	rules: {
		'no-tabs': [ 'error', {
			allowIndentationTabs: true
		} ],
		indent: [ 'error', 'tab' ],
		'no-trailing-spaces': [ 'error', {
			skipBlankLines: false,
			ignoreComments: true
		} ],
		'quote-props': [ 'error', 'as-needed' ],
		'space-before-blocks': [ 'error' ],
		'keyword-spacing': [ 'error' ],
		'space-infix-ops': [ 'error' ],
		'no-console': 0,
		'object-curly-spacing': [ 'error', 'always' ],
		quotes: [ 'error', 'single' ],
		'linebreak-style': 0,
		'import/no-unresolved': 'off',
		semi: [ 2, 'never' ],
		'comma-dangle': [ 'error', 'never' ],
		'array-bracket-spacing': [ 'error', 'always' ],
		'max-len': [ 'error', { code: 150, ignoreComments: true } ],
		'import/prefer-default-export': 'off',
		'no-unused-vars': [ 'error', { argsIgnorePattern: '^_' } ]
	}
}
