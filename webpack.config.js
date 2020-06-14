const path = require('path');
const config = {
	entry: './src/index.ts',
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'index.js'
	},
	module: {
		rules: [
			{
				test: /\.ts(x)?$/,
				use: [
					'awesome-typescript-loader'
				],
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		extensions: [
			'.tsx',
			'.ts',
			'.js'
		]
	}
};

module.exports = config;