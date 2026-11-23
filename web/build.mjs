// Bundles the shared UI into web/dist (committed, so app builds don't need Node).
import { build } from "esbuild";
import { copyFileSync, mkdirSync } from "node:fs";
mkdirSync("dist", { recursive: true });
await build({
  entryPoints: ["src/main.js"], bundle: true, minify: true, format: "iife", target: ["chrome110", "firefox115"],
  outfile: "dist/app.js", legalComments: "eof", logLevel: "info",
});
await build({ entryPoints: ["src/app.css"], bundle: true, minify: true, outfile: "dist/app.css", logLevel: "info" });
copyFileSync("src/index.html", "dist/index.html");
copyFileSync("src/icon.svg", "dist/icon.svg");
