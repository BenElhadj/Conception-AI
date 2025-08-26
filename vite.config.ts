import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    watch: {
      usePolling: true,   // active le polling pour détecter les changements
      interval: 300       // intervalle en ms (300 = 3x/sec, tu peux tester 100 si tu veux plus rapide)
    }
  }
});
