import json from '@rollup/plugin-json'
import { terser } from 'rollup-plugin-terser'
import livereload from 'rollup-plugin-livereload'
import serve from 'rollup-plugin-serve'
import babel from '@rollup/plugin-babel'
import replace from '@rollup/plugin-replace'
import image from '@rollup/plugin-image'
import styles from "rollup-plugin-styles"
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import * as dotenv from 'dotenv'

dotenv.config()

export default [{
	input: 'src/index.js',
	external: ['react','lodash'],
	output: [{
		file: 'public/bundle.js',
		format: 'iife',
	}],
	plugins: [
		babel({
			presets: ["@babel/preset-react"],
			exclude: 'node_modules/**',
			babelHelpers: 'bundled'
		}),
		replace({
			'process.env.NODE_ENV': JSON.stringify('development'),
			preventAssignment: true,
		}),
		image(),
		styles(),
		json(),
		commonjs(),
		livereload(),
		resolve(),
		serve({	
			open:true,
			port: 8082,
			contentBase: 'public'
		})
	]
}, {
	input: 'src/panel/index.jsx',
	output: [{
		file: 'public/panel.js',
		format: 'iife',
		globals: {
			react: 'React'
		}
	}],
	plugins: [
		babel({
			presets: ["@babel/preset-react"],
			exclude: 'node_modules/**',
			babelHelpers: 'bundled'
		}),
		replace({
			'process.env.NODE_ENV': JSON.stringify('development'),
			preventAssignment: true,
		}),
		image(),
		styles(),
		json(),
		commonjs(),
		resolve()
	]
}, {
	input: 'src/tracker/index.jsx',
	output: [{
		file: 'public/tracker.js',
		format: 'iife',
		globals: {
			react: 'React'
		}
	}],
	plugins: [
		babel({
			presets: ["@babel/preset-react"],
			exclude: 'node_modules/**',
			babelHelpers: 'bundled'
		}),
		replace({
			'process.env.NODE_ENV': JSON.stringify('development'),
			preventAssignment: true,
		}),
		image(),
		styles(),
		json(),
		commonjs(),
		resolve()
	]
}]
