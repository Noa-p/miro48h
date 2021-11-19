import json from '@rollup/plugin-json'
import { terser } from 'rollup-plugin-terser'

export default {
	input: 'src/index.js',
	output: [{
		file: 'public/bundle.js',
		format: 'cjs'
	}, {
		file: 'public/bundle.min.js',
		format: 'iife',
		name: 'version',
		plugins: [terser()]
	}],
	plugins: [json()]
}
