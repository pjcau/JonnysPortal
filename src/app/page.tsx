import data from "@/data/repos.json";

type Repo = {
  name: string;
  description: string;
  homepageUrl: string;
  repoUrl: string;
  pushedAt: string;
  language: string | null;
  stars: number;
  topics: string[];
};

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Swift: "#F05138",
  C: "#555555",
  "C++": "#f34b7d",
  Rust: "#dea584",
  Go: "#00ADD8",
  Java: "#b07219",
  "Jupyter Notebook": "#DA5B0B",
  HTML: "#e34c26",
  CSS: "#563d7c",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

function deploymentType(url: string): { label: string; color: string } {
  if (url.includes("vercel.app") || url.includes("vercel."))
    return { label: "Vercel", color: "bg-black text-white dark:bg-white dark:text-black" };
  if (url.includes("github.io"))
    return { label: "GitHub Pages", color: "bg-zinc-700 text-white" };
  if (url.includes("netlify"))
    return { label: "Netlify", color: "bg-teal-600 text-white" };
  return { label: "Web", color: "bg-zinc-500 text-white" };
}

export default function Home() {
  const repos: Repo[] = data.repos;
  const updatedAt = new Date(data.updatedAt);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Jonny&apos;s Portal
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Deployed projects, sorted by latest activity
          </p>
          <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
            Last update: {updatedAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            {" "}&middot; {repos.length} projects
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        <div className="grid gap-4">
          {repos.map((repo) => {
            const deploy = deploymentType(repo.homepageUrl);
            return (
              <article
                key={repo.name}
                className="group rounded-xl border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                        {repo.name}
                      </h2>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${deploy.color}`}>
                        {deploy.label}
                      </span>
                    </div>
                    {repo.description && (
                      <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                        {repo.description}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                      {repo.language && (
                        <span className="flex items-center gap-1.5">
                          <span
                            className="inline-block h-3 w-3 rounded-full"
                            style={{ backgroundColor: LANGUAGE_COLORS[repo.language] || "#888" }}
                          />
                          {repo.language}
                        </span>
                      )}
                      <span>Updated {timeAgo(repo.pushedAt)}</span>
                      {repo.stars > 0 && <span>{repo.stars} stars</span>}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-3">
                  <a
                    href={repo.homepageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Visit Site
                  </a>
                  <a
                    href={repo.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                    </svg>
                    Source
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="mx-auto max-w-4xl px-6 py-6 text-center text-xs text-zinc-400 dark:text-zinc-500">
          Auto-updated nightly via GitHub Actions &middot;{" "}
          <a
            href="https://github.com/pjcau/JonnysPortal"
            className="underline hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            View source
          </a>
        </div>
      </footer>
    </div>
  );
}
