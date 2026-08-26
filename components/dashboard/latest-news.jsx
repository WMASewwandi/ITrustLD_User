"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ImageOff, X } from "lucide-react";
import { fetchPublishedBlogPosts } from "@/lib/dashboard";
import { mapBlogToUpdateItem, mapToDashboardNewsItem } from "@/lib/latest-updates";

function isExternalLink(href) {
  return /^https?:\/\//i.test(String(href || ""));
}

function NewsBanner({ item, className = "", iconSize = "h-10 w-10", children }) {
  const [failed, setFailed] = useState(false);
  const mediaUrl = item.image;
  const showPlaceholder = !mediaUrl || failed;

  return (
    <div className={`relative overflow-hidden bg-[#1a2238] ${className}`}>
      {showPlaceholder ? (
        <div className="flex h-full w-full items-center justify-center">
          <ImageOff className={`text-white/30 ${iconSize}`} aria-hidden />
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={mediaUrl}
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
      className="fixed inset-0 z-[10050] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={post.title}
    >
      <div
        className="max-h-[min(92dvh,calc(100dvh-env(safe-area-inset-bottom,0px)))] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-white/10 bg-[#0B1020] shadow-2xl sm:max-h-[90vh] sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <NewsBanner item={post} className="aspect-[16/10]" iconSize="h-12 w-12">
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

        <div className="p-5 pb-8 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25223E] text-xs font-bold text-white">
                {post.initial}
              </span>
              <span className="text-sm font-medium text-white">{post.author}</span>
            </div>
            {post.date ? <time className="text-xs text-white/40">{post.date}</time> : null}
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

export default function LatestNews({ user: _user, posts: initialPosts }) {
  const [activePost, setActivePost] = useState(null);
  const [items, setItems] = useState(() =>
    Array.isArray(initialPosts) && initialPosts.length
      ? initialPosts.map((post) => mapToDashboardNewsItem(mapBlogToUpdateItem(post)))
      : [],
  );
  const [loading, setLoading] = useState(!(Array.isArray(initialPosts) && initialPosts.length));

  useEffect(() => {
    if (Array.isArray(initialPosts) && initialPosts.length) {
      setItems(initialPosts.map((post) => mapToDashboardNewsItem(mapBlogToUpdateItem(post))));
      setLoading(false);
      return undefined;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const posts = await fetchPublishedBlogPosts();
        if (!cancelled) {
          setItems(posts.map((post) => mapToDashboardNewsItem(mapBlogToUpdateItem(post))));
        }
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [initialPosts]);

  return (
    <>
      <section className="border-t border-white/6 bg-[#0E1424]/70">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Latest <span className="text-theme-green-action">News</span>
            </h2>
            <p className="mt-2 text-sm text-white/50">
              Stay informed with our latest news and announcements
            </p>
          </div>

          {loading ? (
            <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-10 text-center text-sm text-white/50">
              Loading news…
            </p>
          ) : items.length === 0 ? (
            <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-10 text-center text-sm text-white/50">
              No news posts available yet. Check back soon.
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
                    item={item}
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
                      {item.date ? <time className="text-xs text-white/40">{item.date}</time> : null}
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
              href="/news"
              className="inline-flex items-center justify-center rounded-xl border border-theme-green-action/30 px-5 py-2.5 text-sm font-semibold text-theme-green-action transition hover:bg-theme-green-action hover:text-white"
            >
              View All News
            </Link>
            <Link
              href="/support"
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
