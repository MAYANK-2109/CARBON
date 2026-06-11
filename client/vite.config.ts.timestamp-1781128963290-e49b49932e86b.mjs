// vite.config.ts
import { defineConfig } from "file:///C:/Users/mayan/Documents/GitHub/CARBON/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/mayan/Documents/GitHub/CARBON/node_modules/@vitejs/plugin-react/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [react()],
  esbuild: {
    jsx: "automatic"
  },
  test: {
    globals: true,
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}", "src/**/*.spec.{ts,tsx}"],
    exclude: ["node_modules", "dist"],
    setupFiles: ["./src/test/setup.ts"],
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/main.tsx",
        "src/test/**",
        "src/**/*.test.{ts,tsx}",
        "src/**/*.spec.{ts,tsx}"
      ]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxtYXlhblxcXFxEb2N1bWVudHNcXFxcR2l0SHViXFxcXENBUkJPTlxcXFxjbGllbnRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXG1heWFuXFxcXERvY3VtZW50c1xcXFxHaXRIdWJcXFxcQ0FSQk9OXFxcXGNsaWVudFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvbWF5YW4vRG9jdW1lbnRzL0dpdEh1Yi9DQVJCT04vY2xpZW50L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKV0sXG4gIGVzYnVpbGQ6IHtcbiAgICBqc3g6ICdhdXRvbWF0aWMnLFxuICB9LFxuICB0ZXN0OiB7XG4gICAgZ2xvYmFsczogdHJ1ZSxcbiAgICBlbnZpcm9ubWVudDogJ2pzZG9tJyxcbiAgICBpbmNsdWRlOiBbJ3NyYy8qKi8qLnRlc3Que3RzLHRzeH0nLCAnc3JjLyoqLyouc3BlYy57dHMsdHN4fSddLFxuICAgIGV4Y2x1ZGU6IFsnbm9kZV9tb2R1bGVzJywgJ2Rpc3QnXSxcbiAgICBzZXR1cEZpbGVzOiBbJy4vc3JjL3Rlc3Qvc2V0dXAudHMnXSxcbiAgICBjc3M6IHRydWUsXG4gICAgY292ZXJhZ2U6IHtcbiAgICAgIHByb3ZpZGVyOiAndjgnLFxuICAgICAgcmVwb3J0ZXI6IFsndGV4dCcsICdsY292J10sXG4gICAgICBpbmNsdWRlOiBbJ3NyYy8qKi8qLnt0cyx0c3h9J10sXG4gICAgICBleGNsdWRlOiBbXG4gICAgICAgICdzcmMvbWFpbi50c3gnLFxuICAgICAgICAnc3JjL3Rlc3QvKionLFxuICAgICAgICAnc3JjLyoqLyoudGVzdC57dHMsdHN4fScsXG4gICAgICAgICdzcmMvKiovKi5zcGVjLnt0cyx0c3h9JyxcbiAgICAgIF0sXG4gICAgfSxcbiAgfSBhcyBhbnksXG59IGFzIGFueSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXVVLFNBQVMsb0JBQW9CO0FBQ3BXLE9BQU8sV0FBVztBQUVsQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsU0FBUztBQUFBLElBQ1AsS0FBSztBQUFBLEVBQ1A7QUFBQSxFQUNBLE1BQU07QUFBQSxJQUNKLFNBQVM7QUFBQSxJQUNULGFBQWE7QUFBQSxJQUNiLFNBQVMsQ0FBQywwQkFBMEIsd0JBQXdCO0FBQUEsSUFDNUQsU0FBUyxDQUFDLGdCQUFnQixNQUFNO0FBQUEsSUFDaEMsWUFBWSxDQUFDLHFCQUFxQjtBQUFBLElBQ2xDLEtBQUs7QUFBQSxJQUNMLFVBQVU7QUFBQSxNQUNSLFVBQVU7QUFBQSxNQUNWLFVBQVUsQ0FBQyxRQUFRLE1BQU07QUFBQSxNQUN6QixTQUFTLENBQUMsbUJBQW1CO0FBQUEsTUFDN0IsU0FBUztBQUFBLFFBQ1A7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFROyIsCiAgIm5hbWVzIjogW10KfQo=
