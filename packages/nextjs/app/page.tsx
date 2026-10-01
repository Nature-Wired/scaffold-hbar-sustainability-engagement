"use client";

import { FormEvent, useState } from "react";

type SustainabilityProject = {
  sourceTimestamp: string | null;
  name: string | null;
  country: string | null;
  registryName: string | null;
  developer: string | null;
  methodology: string | null;
  category: string | null;
  sector: string | null;
  status: string | null;
  lifecycleStage: string | null;
  sdgs: number[];
};

type SearchResponse = {
  raw?: {
    query: string;
    count: number;
    projects: SustainabilityProject[];
  };
  humanMessage?: string;
  error?: string;
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [projects, setProjects] = useState<SustainabilityProject[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const searchQuery = query.trim();

    if (!searchQuery) {
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(`/api/sustainability/projects?query=${encodeURIComponent(searchQuery)}&pageSize=10`);

      const data = (await response.json()) as SearchResponse;

      if (!response.ok) {
        throw new Error(data.error || "Unable to search projects.");
      }

      setProjects(data.raw?.projects || []);
      setMessage(data.humanMessage || "");
    } catch (error) {
      setProjects([]);
      setMessage(error instanceof Error ? error.message : "Unable to search Sustainability Atlas projects.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-12">
      <section className="mb-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">Built with Scaffold-HBAR</p>

        <h1 className="mb-4 text-4xl font-bold">Discover sustainability projects</h1>

        <p className="max-w-3xl text-lg text-base-content/70">
          Search verified Sustainability Atlas project data and explore projects that can be connected to transparent
          participation on Hedera.
        </p>
      </section>

      <form onSubmit={handleSearch} className="mb-10 flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder="Search projects, for example reforestation"
          className="input input-bordered w-full"
        />

        <button type="submit" className="btn btn-primary sm:min-w-32" disabled={isLoading}>
          {isLoading ? "Searching..." : "Search"}
        </button>
      </form>

      {message && <div className="mb-6 rounded-xl bg-base-200 p-4 text-sm">{message}</div>}

      <section className="grid gap-6 md:grid-cols-2">
        {projects.map(project => (
          <article
            key={project.sourceTimestamp || project.name}
            className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm"
          >
            <div className="mb-4">
              <p className="mb-2 text-sm font-medium text-primary">{project.registryName || "Sustainability Atlas"}</p>

              <h2 className="text-xl font-bold">{project.name || "Unnamed project"}</h2>

              {project.country && <p className="mt-1 text-base-content/60">{project.country}</p>}
            </div>

            <dl className="space-y-3 text-sm">
              {project.developer && (
                <div>
                  <dt className="font-semibold">Developer</dt>
                  <dd className="text-base-content/70">{project.developer}</dd>
                </div>
              )}

              {project.methodology && (
                <div>
                  <dt className="font-semibold">Methodology</dt>
                  <dd className="break-words text-base-content/70">{project.methodology}</dd>
                </div>
              )}

              {(project.category || project.sector) && (
                <div>
                  <dt className="font-semibold">Category</dt>
                  <dd className="text-base-content/70">
                    {[project.category, project.sector].filter(Boolean).join(" · ")}
                  </dd>
                </div>
              )}

              {(project.lifecycleStage || project.status) && (
                <div>
                  <dt className="font-semibold">Lifecycle</dt>
                  <dd className="text-base-content/70">
                    {[project.lifecycleStage, project.status].filter(Boolean).join(" · ")}
                  </dd>
                </div>
              )}
            </dl>

            {project.sdgs.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {project.sdgs.map(sdg => (
                  <span key={sdg} className="badge badge-outline">
                    SDG {sdg}
                  </span>
                ))}
              </div>
            )}

            <button
              type="button"
              className="btn btn-outline btn-sm mt-6"
              title="Hedera participation recording will be added next"
            >
              Choose this project
            </button>
          </article>
        ))}
      </section>
    </main>
  );
}
