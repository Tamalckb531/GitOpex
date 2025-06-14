import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        content: resolve(__dirname, "src/content/content.ts"),
        background: resolve(__dirname, "src/background/background.ts"),
      },
      output: {
        entryFileNames: (chunk) => {
          if (chunk.name === "content") return "content.js";
          if (chunk.name === "background") return "background.js";
          return "[name].[hash].js";
        },
        chunkFileNames: "[name].[hash].js",
        assetFileNames: "[name].[ext]",
      },
    },
    outDir: "dist",
    emptyOutDir: true,
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify(
      process.env.NODE_ENV || "development"
    ),
  },
});

/*
import { defineConfig } from "vite";
import tailwindcss from '@tailwindcss/vite'
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    tailwindcss(),
    viteStaticCopy({
      targets: [
        {
          src: "public/manifest.json",
          dest: ".",
        },
      ],
    }),
  ],
  build: {
    outDir: "build",
    rollupOptions: {
      input: {
        main: "./index.html",
      },
    },
  },
});

*/
