import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: { tsconfigPaths: true }, // "@/..." の import をテストでも使えるように
  test: { environment: 'node' },
})
