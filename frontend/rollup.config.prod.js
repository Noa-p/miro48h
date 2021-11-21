import json from '@rollup/plugin-json'
import { terser } from 'rollup-plugin-terser'
import image from '@rollup/plugin-image'
import styles from "rollup-plugin-styles";
import { babel } from '@rollup/plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import * as dotenv from 'dotenv'

dotenv.config()

export default [{
	input: 'src/index.js',
	external: ['react'],
	output: [{
		file: 'public/bundle.js',
		format: 'cjs'
	}],
	plugins: [
		babel({
			presets: ["@babel/preset-react"],
			exclude: 'node_modules/**'
		}),
		image(),
		styles(),
		json()
	]
}, {
	input: 'src/panel/index.jsx',
	output: [{
		file: 'public/panel.js',
		format: 'cjs',
		globals: {
			react: 'React'
		}
	}],
	plugins: [
		babel({
			presets: ["@babel/preset-react"],
			exclude: 'node_modules/**'
		}),
		image(),
		styles(),
		json()
	]
}, {
	input: 'src/tracker/index.jsx',
	output: [{
		file: 'public/tracker.js',
		format: 'cjs',
		globals: {
			react: 'React'
		}
	}],
	plugins: [
		babel({
			presets: ["@babel/preset-react"],
			exclude: 'node_modules/**'
		}),
		image(),
		styles(),
		json(),
		commonjs(),
		resolve()
	]
}]
