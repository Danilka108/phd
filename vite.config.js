import { defineConfig } from 'vite'
import { resolve } from 'path';
import handlebars from 'vite-plugin-handlebars';

export default defineConfig({
  plugins: [handlebars({
    partialDirectory: resolve(__dirname, 'includes'),
  }),
  {
    name: 'remove-vite-client-for-frame',
    transformIndexHtml(html, ctx) {
      if (ctx.filename.includes('frame')) {
        return html.replace(
          /<script type="module" src="\/@vite\/client"><\/script>/,
          ''
        );
      }
      return html;
    },
  },
  ]
  ,
  server: {
    open: true
  }
})
