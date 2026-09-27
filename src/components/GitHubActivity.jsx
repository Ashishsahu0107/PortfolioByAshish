import React, { useRef, useEffect, useState, cloneElement } from "react";
import { motion, useInView } from "framer-motion";
import { Star, GitFork, Users } from "lucide-react";
import { GithubIcon } from "./icons";
import { developer } from "../data/developer";
import { GitHubCalendar } from "react-github-calendar";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
export default function GitHubActivity() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  const [stats, setStats] = useState({
    repos: "-",
    stars: "-",
    forks: "-",
    followers: "-",
  });

  const username = developer.github.split("/").pop();

  useEffect(() => {
    if (!username) return;

    const fetchGitHubStats = async () => {
      try {
        // Fetch user basic info
        const userRes = await fetch(`https://api.github.com/users/${username}`);
        if (!userRes.ok) return;
        const userData = await userRes.json();

        // Fetch repos for stars & forks
        const reposRes = await fetch(
          `https://api.github.com/users/${username}/repos?per_page=100`,
        );
        let stars = 0;
        let forks = 0;

        if (reposRes.ok) {
          const reposData = await reposRes.json();
          reposData.forEach((repo) => {
            stars += repo.stargazers_count;
            forks += repo.forks_count;
          });
        }

        setStats({
          repos: userData.public_repos || 0,
          stars,
          forks,
          followers: userData.followers || 0,
        });
      } catch (error) {
        console.error("Failed to fetch GitHub stats", error);
      }
    };

    fetchGitHubStats();
  }, [username]);

  return (
    <section
      aria-label="GitHub Activity"
      className="py-24 bg-[var(--bg-secondary)]"
      ref={ref}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-600/10 border border-blue-600/20 rounded-full text-blue-400 text-xs font-semibold uppercase tracking-widest mb-6">
                Open Source
              </div>
              <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[1.1] tracking-tight mt-3">
                GitHub Activity.
              </h2>
            </div>

            <a
              href={developer.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full font-semibold text-sm transition-all whitespace-nowrap cursor-pointer bg-transparent text-[var(--text-primary)] border border-[var(--border-medium)] hover:bg-[var(--bg-card)] hover:border-blue-600/40 hover:-translate-y-0.5"
            >
              <GithubIcon size={18} /> View Profile
            </a>
          </div>

          <div className="p-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] overflow-hidden">
            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {[
                {
                  label: "Followers",
                  value: stats.followers,
                  icon: <Users size={16} />,
                },
                {
                  label: "Repositories",
                  value: stats.repos,
                  icon: <GithubIcon size={16} />,
                },
                {
                  label: "Stars Earned",
                  value: stats.stars,
                  icon: <Star size={16} />,
                },
                {
                  label: "Forks",
                  value: stats.forks,
                  icon: <GitFork size={16} />,
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-4 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-subtle)]"
                >
                  <div className="flex items-center gap-2 text-[var(--text-muted)] mb-2">
                    {stat.icon}{" "}
                    <span className="text-xs uppercase tracking-wider font-semibold">
                      {stat.label}
                    </span>
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Heatmap (Real GitHub Chart) */}
            <div className="w-full overflow-x-auto pb-4 hide-scrollbar flex justify-center">
              {username && (
                <div className="min-w-[750px] p-6 bg-[#0d1117] border border-[#30363d] rounded-xl inline-block text-white">
                  <GitHubCalendar
                    username={username}
                    colorScheme="dark"
                    theme={{
                      dark: [
                        "#161b22",
                        "#0e4429",
                        "#006d32",
                        "#26a641",
                        "#39d353",
                      ],
                    }}
                    blockSize={12}
                    blockMargin={4}
                    fontSize={12}
                    renderBlock={(block, activity) =>
                      cloneElement(block, {
                        "data-tooltip-id": "github-tooltip",
                        "data-tooltip-content": `${activity.count} contributions on ${activity.date}`,
                        className: "cursor-pointer hover:stroke-white/30",
                        key: activity.date,
                      })
                    }
                  />
                  <Tooltip id="github-tooltip" style={{ zIndex: 1000 }} />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
