import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "Docs" },
    { path: "/lunar", component: "Lunar" },
  ],
  npmClient: "pnpm",
  alias: {
    "@": "./src",
  },
});
