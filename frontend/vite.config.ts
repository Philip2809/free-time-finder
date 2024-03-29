import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import filterReplace from 'vite-plugin-filter-replace';

const apiUrl = 'http://localhost:5000';

// https://vitejs.dev/config/
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
