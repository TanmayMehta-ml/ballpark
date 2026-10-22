import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// Relative base so the same build works on GitHub Pages (/ballpark/) and inside the Android WebView.
export default defineConfig({
  base: './',
  plugins: [react()],
  test: { include: ['src/**/*.test.ts'] },
})
