import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	build: {
		outDir: 'build'
	},
	base: process.env.NODE_ENV === 'production' ? '/Conception-AI/' : './'
});