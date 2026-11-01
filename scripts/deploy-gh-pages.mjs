#!/usr/bin/env node
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");

function readSiteConfig() {
  const configPath = path.join(rootDir, "site.config.json");
  try {
    return JSON.parse(fs.readFileSync(configPath, "utf-8"));
  } catch (err) {
    console.error(`Cannot read site.config.json at ${configPath}: ${err.message}`);
    process.exit(1);
  }
}

function run(cmd, opts) {
  try {
    return execSync(cmd, opts);
  } catch (err) {
    console.error(`Command failed: ${cmd}\n${err.message}`);
    process.exit(1);
  }
}

const siteConfig = readSiteConfig();

console.log("1. Running build & deterministic verification gate...");
run("pnpm build", { stdio: "inherit", cwd: rootDir });

console.log("2. Ensuring CNAME and .nojekyll in dist/...");
fs.writeFileSync(path.join(distDir, "CNAME"), `${siteConfig.domain}\n`, "utf-8");
fs.writeFileSync(path.join(distDir, ".nojekyll"), "", "utf-8");

const originUrl = run("git config --get remote.origin.url", {
  encoding: "utf-8",
  cwd: rootDir,
}).trim();

if (!originUrl) {
  console.error("Could not determine git remote origin URL.");
  process.exit(1);
}

console.log("3. Pushing verified static artifact to gh-pages branch...");
const distGit = path.join(distDir, ".git");
if (fs.existsSync(distGit)) {
  fs.rmSync(distGit, { recursive: true, force: true });
}

run("git init", { cwd: distDir, stdio: "pipe" });
run("git add -A", { cwd: distDir, stdio: "pipe" });
run('git commit -m "deploy: update gh-pages static release [skip ci]"', {
  cwd: distDir,
  stdio: "pipe",
});
run(`git push -f ${originUrl} HEAD:gh-pages`, {
  cwd: distDir,
  stdio: "inherit",
});

fs.rmSync(distGit, { recursive: true, force: true });
console.log(`\nDeployed to gh-pages -> ${siteConfig.origin}`);
