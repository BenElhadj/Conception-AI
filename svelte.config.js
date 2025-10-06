import vercel from '@sveltejs/adapter-vercel';
import node from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: process.env.RENDER
			? node()       // si déploiement sur Render
			: vercel()     // sinon Vercel par défaut
	}
};

export default config;
