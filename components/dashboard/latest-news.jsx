"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ImageOff, X } from "lucide-react";
import { fetchPublishedBlogPosts } from "@/lib/dashboard";
function sortPostsByCreatedDesc(posts) {
  return [...posts].sort((a, b) => {
    const aTime = new Date(a.createdAt || a.date).getTime();
    const bTime = new Date(b.createdAt || b.date).getTime();
    if (!Number.isNaN(aTime) && !Number.isNaN(bTime) && aTime !== bTime) {
      return bTime - aTime;
    }
    return (Number(b.id) || 0) - (Number(a.id) || 0);
  });
}

function NewsBanner({ image, className = "", iconSize = "h-10 w-10", children }) {
  const [failed, setFailed] = useState(false);
  const showPlaceholder = !image || failed;

  return (
    <div className={`relative overflow-hidden bg-[#1a2238] ${className}`}>
      {showPlaceholder ? (
        <div className="flex h-full w-full items-center justify-center">
          <ImageOff className={`text-white/30 ${iconSize}`} aria-hidden />
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
      {children}
    </div>
  );
}

function NewsDetailModal({ post, onClose }) {
  if (!post) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={post.title}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-white/10 bg-[#0B1020] shadow-2xl [-ms-overflow-style:none] [scrollbar-width:none] sm:rounded-2xl [&::-webkit-scrollbar]:hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <NewsBanner image={post.image} className="aspect-[16/10]" iconSize="h-12 w-12">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B1020] via-[#0B1020]/40 to-transparent" />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 rounded-lg bg-black/50 p-1.5 text-white transition hover:bg-black/70"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </NewsBanner>

        <div className="p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25223E] text-xs font-bold text-white">
                {post.initial}
              </span>
              <span className="text-sm font-medium text-white">{post.author}</span>
            </div>
            <time className="text-xs text-white/40">{post.date}</time>
          </div>

          <h3 className="text-xl font-bold text-white sm:text-2xl">{post.title}</h3>
          <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-white/70 sm:text-base">
            {post.excerpt}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LatestNews({ posts = [] }) {
  const [activePost, setActivePost] = useState(null);
  const [livePosts, setLivePosts] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPosts() {
      try {
        const postsFromApi = await fetchPublishedBlogPosts();
        if (!cancelled && postsFromApi.length > 0) {
          setLivePosts(postsFromApi);
        }
      } catch {
        // Fall back to dashboard payload when the public blogs endpoint is unavailable.
      }
    }

    loadPosts();
    return () => {
      cancelled = true;
    };
  }, []);

  const items = useMemo(
    () => sortPostsByCreatedDesc(Array.isArray(livePosts ?? posts) ? (livePosts ?? posts) : []),
    [livePosts, posts],
  );
  return (
    <>
      <section className="border-t border-white/6 bg-[#0E1424]/70">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Latest <span className="text-theme-green-action">News</span>
            </h2>
            <p className="mt-2 text-sm text-white/50">Stay informed with our latest news updates</p>
          </div>

          {items.length === 0 ? (
            <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-10 text-center text-sm text-white/50">
              No news posts published yet. Check back soon.
            </p>
          ) : (
            <div className="grid auto-rows-fr gap-5 md:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActivePost(item)}
                  className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] text-left transition hover:border-white/15 hover:bg-white/[0.05]"
                >
                  <NewsBanner
                    image={item.image}
                    className="aspect-[16/10] shrink-0 transition duration-500 group-hover:scale-[1.02]"
                    iconSize="h-9 w-9"
                  >
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0E1424]/80 to-transparent" />
                  </NewsBanner>
                  <div className="flex min-h-0 flex-1 flex-col p-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25223E] text-xs font-bold text-white">
                          {item.initial}
                        </span>
                        <span className="text-sm font-medium text-white">{item.author}</span>
                      </div>
                      <time className="text-xs text-white/40">{item.date}</time>
                    </div>
                    <h3 className="text-base font-semibold text-white transition group-hover:text-theme-green-action">
                      {item.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-white/50">
                      {item.excerpt}
                    </p>
                    <span className="mt-auto inline-flex pt-4 text-sm font-medium text-theme-green-action transition group-hover:underline">
                      Read more
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard/help"
              className="inline-flex text-sm font-medium text-theme-green-action transition hover:underline"
            >
              Need help? Contact support
            </Link>
          </div>
        </div>
      </section>

      <NewsDetailModal post={activePost} onClose={() => setActivePost(null)} />
    </>
  );
}
