import adapter from '@sveltejs/adapter-node'
import autoprefixer from 'autoprefixer'
import preprocess from 'svelte-preprocess'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess({
    scss: {
      prependData: `
      @import 'src/styles/mediaquery.scss';
      @import 'src/styles/variables.scss';
      `
    },
    postcss: {
      plugins: [autoprefixer]
    }
  }),
  kit: {
    adapter: adapter(),
    alias: {
      '$api/*': './src/api/*',
      '$assets/*': './src/assets/*',
      '$routes/*': './src/routes/*',
      '$stores/*': './src/stores/*',
      '$styles/*': './src/styles/*'
    }
  }
}

export default config
