import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: '404.html', // Gardez 404.html pour GitHub Pages
			precompress: false
		}),
		paths: {
			base: process.env.NODE_ENV === 'production' ? '/Conception-AI' : ''
		}
	}
};

export default config;