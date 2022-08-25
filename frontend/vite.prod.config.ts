import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import filterReplace from 'vite-plugin-filter-replace';

const apiUrl = 'https://api.phma.dev/ftf';

export default defineConfig({
  plugins: [
    filterReplace([
      {
        filter: 'src/app/helpers/environment.tsx',
        replace: [
          { from: '__API_URL__' , to: apiUrl }
        ]
      }
    ]),
    react(),
  ],
})
