import json from '@rollup/plugin-json'
import { terser } from 'rollup-plugin-terser'
import livereload from 'rollup-plugin-livereload'
import serve from 'rollup-plugin-serve'
import * as dotenv from 'dotenv'

dotenv.config()

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
	plugins: [
		json(),
		livereload(),
		serve({	
			open:true,
			port: 8082,
			contentBase: 'public'
		})
	]
}
