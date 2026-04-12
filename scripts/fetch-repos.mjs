import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const GITHUB_USER = "pjcau";
const OUTPUT_PATH = join(__dirname, "..", "src", "data", "repos.json");

async function fetchRepos() {
  const token = process.env.GITHUB_TOKEN;
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "JonnysPortal",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let allRepos = [];
  let page = 1;

  while (true) {
    const url = `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&page=${page}&sort=pushed`;
    const res = await fetch(url, { headers });

    if (!res.ok) {
      console.error(`GitHub API error: ${res.status} ${res.statusText}`);
      break;
    }

    const repos = await res.json();
    if (repos.length === 0) break;

    allRepos = allRepos.concat(repos);
    page++;
  }

  // Filter: only repos with a homepage that looks like GitHub Pages or Vercel
  const deployed = allRepos
    .filter((r) => {
      const url = r.homepage;
      if (!url || url.trim() === "") return false;
      const lower = url.toLowerCase();
      return (
        lower.includes("github.io") ||
        lower.includes("vercel.app") ||
        lower.includes("vercel.") ||
        lower.includes("netlify")
      );
    })
    .map((r) => ({
      name: r.name,
      description: r.description || "",
      homepageUrl: r.homepage,
      repoUrl: r.html_url,
      pushedAt: r.pushed_at,
      language: r.language,
      stars: r.stargazers_count,
      topics: r.topics || [],
    }))
    .sort((a, b) => new Date(b.pushedAt).getTime() - new Date(a.pushedAt).getTime());

  const output = {
    updatedAt: new Date().toISOString(),
    repos: deployed,
  };

  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
  console.log(`Fetched ${deployed.repos?.length ?? deployed.length} deployed repos (${allRepos.length} total scanned)`);
}

fetchRepos().catch((err) => {
  console.error("Failed to fetch repos:", err);
  process.exit(1);
});
