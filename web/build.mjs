// Bundles the shared UI into web/dist (committed, so app builds don't need Node).
import { build } from "esbuild";
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
mkdirSync("dist", { recursive: true });
await build({
  entryPoints: ["src/main.js"], bundle: true, minify: true, format: "iife", target: ["chrome110", "firefox115"],
  outfile: "dist/app.js", legalComments: "eof", logLevel: "info",
});
await build({ entryPoints: ["src/app.css"], bundle: true, minify: true, outfile: "dist/app.css", logLevel: "info" });
copyFileSync("src/index.html", "dist/index.html");
copyFileSync("src/icon.svg", "dist/icon.svg");
// Static demo (docs/demo) = the same bundle + a mocked API, for previews without a controller.
mkdirSync("../docs/demo", { recursive: true });
for (const f of ["app.js", "app.css", "icon.svg"]) copyFileSync("dist/" + f, "../docs/demo/" + f);
writeFileSync("../docs/demo/index.html", readFileSync("dist/index.html", "utf8").replace('<script src="app.js"></script>', '<script src="mock.js"></script>\n<script src="app.js"></script>'));
