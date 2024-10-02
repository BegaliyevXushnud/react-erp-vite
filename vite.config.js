import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve:{
    alias:[
      {find: '@', replacement:'/src'},
      {find: '@pages', replacement:'/src/pages'},
      { find: '@service', replacement: '/src/service' },
      { find: '@component', replacement: '/src/component' },
      { find: '@modals', replacement: '/src/component/modal' }
    ]
  }
})
