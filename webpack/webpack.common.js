const HTMLWebpackPlugins = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path'); //для того чтобы превратить отнсительный путь в абсолютный мы будем использовать пакет path
const webpack = require('webpack');

const production = process.env.NODE_ENV === 'production';

module.exports = {
	entry: path.resolve(__dirname, '..', './src/index.tsx'), //точка входа в наше приложение содержит абсолютный путь к index.ts
	output: {
		path: path.resolve(__dirname, '..', './dist'), //путь куда будет собираться наш проект
		filename: production
			? 'static/scripts/[name].[contenthash].js'
			: 'static/scripts/[name].js', // имя нашего бандла
		publicPath: process.env.PUBLIC_PATH ? process.env.PUBLIC_PATH : '/',
		chunkFilename: 'static/scripts/[name].[contenthash].bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.[tj]sx?$/, //содержит регулярное выражение, которое содержит информацию какие файлы должны обрабатываться этим loader'ом
				use: [
					{
						loader: 'ts-loader',
					},
				], exclude: /node_modules/,
			},
			{
				test: /\.(png|jpg|gif|webp)$/,
				type: 'asset/resource',
				generator: {
					filename: 'static/images/[hash][ext][query]',
				},
			},
			{
				test: /\.(woff(2)?|eot|ttf|otf)$/,
				type: 'asset/resource',
				generator: {
					filename: 'static/fonts/[hash][ext][query]',
				},
			},
			{
				test: /\.svg$/i,
				issuer: /\.[jt]sx?$/,
				use: ['@svgr/webpack', 'url-loader'],
			},
			{
				test: /\.(sa|sc|c)ss$/,
				use: [
					production ? MiniCssExtractPlugin.loader : 'style-loader',
					{
						loader: 'css-loader',
						options: {
							modules: {
								mode: 'local',
								localIdentName: '[name]__[local]__[hash:base64:5]',
								auto: /\.module\.\w+$/i,
							},
							importLoaders: 2,
						},
					},
					'postcss-loader',
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true,
						},
					},
				],
			},
		],
	},
	resolve: {
		extensions: ['.js', '.jsx', '.tsx', '.ts', '.json'], //указываем файлы с которыми будет работать webpack
		fallback: {
			"process": require.resolve("process/browser")
		}
	},
	plugins: [
		new HTMLWebpackPlugins({
			template: path.resolve(__dirname, '..', './public/index.html'),
		}),
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: production
				? 'static/styles/[name].[contenthash].css'
				: 'static/styles/[name].css',
		}),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
			'process.env.PUBLIC_PATH': JSON.stringify(process.env.PUBLIC_PATH || '/'),
			'process': JSON.stringify({ env: { 
				NODE_ENV: process.env.NODE_ENV || 'development',
				PUBLIC_PATH: process.env.PUBLIC_PATH || '/'
			}})
		}),
		new webpack.ProvidePlugin({
			process: 'process/browser',
		}),
	],
};