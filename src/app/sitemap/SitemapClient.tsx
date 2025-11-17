"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type UrlItem = {
    loc: string;
    path: string; // pathname only
    lastmod?: string;
    changefreq?: string;
    priority?: string;
};

function toPath(href: string): string {
    try {
        const u = new URL(href);
        return u.pathname || "/";
    } catch {
        // if already a path
        if (href.startsWith("/")) return href || "/";
        return "/";
    }
}

const HTMLSitemap = () => {
    const [items, setItems] = useState<UrlItem[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                const res = await fetch("/sitemap.xml", { cache: "no-store" });
                if (!res.ok) throw new Error(`Failed to fetch sitemap: ${res.status}`);
                const xmlText = await res.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(xmlText, "application/xml");

                // Check for parsererror
                const errNode = doc.getElementsByTagName("parsererror")[0];
                if (errNode) throw new Error("Invalid XML in sitemap.xml");

                const urlNodes = doc.getElementsByTagName("url");
                const seen = new Set<string>();
                const parsed: UrlItem[] = [];
                for (let i = 0; i < urlNodes.length; i++) {
                    const node = urlNodes[i];
                    const loc = node.getElementsByTagName("loc")[0]?.textContent?.trim();
                    if (!loc) continue;
                    const lastmod = node.getElementsByTagName("lastmod")[0]?.textContent?.trim();
                    const changefreq = node.getElementsByTagName("changefreq")[0]?.textContent?.trim();
                    const priority = node.getElementsByTagName("priority")[0]?.textContent?.trim();
                    const path = toPath(loc).replace(/\/$/, ""); // drop trailing slash for consistency
                    if (!seen.has(path)) {
                        seen.add(path);
                        parsed.push({ loc, path: path || "/", lastmod, changefreq, priority });
                    }
                }
                if (!cancelled) setItems(parsed);
            } catch (e: unknown) {
                if (!cancelled) {
                    const message = e instanceof Error ? e.message : typeof e === "string" ? e : "Failed to load sitemap";
                    setError(message);
                }
            }
        }
        load();
        return () => {
            cancelled = true;
        };
    }, []);

    const groups = useMemo(() => {
        const data = items || [];
        const normalized = data.map((d) => ({ ...d, path: d.path || "/" }));

        const isLegal = (p: string) => p === "/privacy" || p === "/terms";
        const isBlog = (p: string) => p.startsWith("/blog/");
        const isCalendar = (p: string) => p.startsWith("/exhibition-calendar/");
        const isProject = (p: string) => p.startsWith("/projects/");
        const isStand = (p: string) => p.startsWith("/exhibition-sub/");
        const isSelf = (p: string) => p === "/sitemap" || p === "/sitemap.xml";

        // Depth helps pick "main" pages (e.g., /about-us), avoid deep pages
        const depth = (p: string) => (p === "/" ? 0 : p.split("/").filter(Boolean).length);

        const homeItem = normalized.find((i) => i.path === "/");
        const legal = normalized.filter((i) => isLegal(i.path));
        const blogs = normalized.filter((i) => isBlog(i.path));
        const calendars = normalized.filter((i) => isCalendar(i.path));
        const projects = normalized.filter((i) => isProject(i.path));
        const stands = normalized.filter((i) => isStand(i.path));
        const mains = normalized.filter(
            (i) => !isSelf(i.path) && !isLegal(i.path) && !isBlog(i.path) && !isCalendar(i.path) && depth(i.path) <= 1
        );

        // Sort for nicer UX
        const sortByPath = (a: UrlItem, b: UrlItem) => a.path.localeCompare(b.path);
        mains.sort(sortByPath);
        legal.sort(sortByPath);
        blogs.sort(sortByPath);
        calendars.sort(sortByPath);
        projects.sort(sortByPath);
        stands.sort(sortByPath);

        return { homeItem, mains, legal, blogs, calendars, projects, stands };
    }, [items]);

    return (
        <div className="min-h-screen p-8 py-20 bg-white md:py-36">
            <main className="max-w-5xl px-4 py-10 mx-auto">
                <h1 className="mb-8 text-3xl font-bold text-black">HTML Sitemap</h1>

                {error && (
                    <p className="mb-8 text-sm text-red-600">{error}</p>
                )}

                {!items && !error && (
                    <p className="mb-8 text-gray-600">Loading sitemap…</p>
                )}

                {items && (
                    <>
                        <section className="mb-10">
                            <h2 className="mb-2 text-xl font-semibold text-black">Main Pages</h2>
                            <ul className="grid gap-2 pl-5 list-disc sm:grid-cols-2">
                                {groups.homeItem && (
                                    <li>
                                        <Link href="/" className="text-blue-600 hover:underline">
                                            Home
                                        </Link>
                                    </li>
                                )}
                                {groups.mains.map((i) => (
                                    <li key={i.path}>
                                        <Link href={i.path} className="text-blue-600 hover:underline">
                                            {decodeURIComponent(i.path.replace(/^\//, "")).replace(/-/g, " ").trim() || "Home"}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {groups.blogs.length > 0 && (
                            <section className="mb-10">
                                <h2 className="mb-2 text-xl font-semibold text-black">Blog</h2>
                                <ul className="grid gap-2 pl-5 list-disc sm:grid-cols-2">
                                    {groups.blogs.map((i) => (
                                        <li key={i.path}>
                                            <Link href={i.path} className="text-blue-600 hover:underline">
                                                {decodeURIComponent(i.path.replace("/blog/", "")).replace(/-/g, " ").trim()}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {groups.calendars.length > 0 && (
                            <section className="mb-10">
                                <h2 className="mb-2 text-xl font-semibold text-black">Exhibition Calendar</h2>
                                <ul className="grid gap-2 pl-5 list-disc sm:grid-cols-2">
                                    {groups.calendars.map((i) => (
                                        <li key={i.path}>
                                            <Link href={i.path} className="text-blue-600 hover:underline">
                                                {decodeURIComponent(i.path.replace("/exhibition-calendar/", "")).replace(/-/g, " ").trim()}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {groups.projects.length > 0 && (
                            <section className="mb-10">
                                <h2 className="mb-2 text-xl font-semibold text-black">Projects</h2>
                                <ul className="grid gap-2 pl-5 list-disc sm:grid-cols-2">
                                    {groups.projects.map((i) => (
                                        <li key={i.path}>
                                            <Link href={i.path} className="text-blue-600 hover:underline">
                                                {decodeURIComponent(i.path.replace("/projects/", "")).replace(/-/g, " ").trim()}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {groups.stands.length > 0 && (
                            <section className="mb-10">
                                <h2 className="mb-2 text-xl font-semibold text-black">Exhibition Stands</h2>
                                <ul className="grid gap-2 pl-5 list-disc sm:grid-cols-2">
                                    {groups.stands.map((i) => (
                                        <li key={i.path}>
                                            <Link href={i.path} className="text-blue-600 hover:underline">
                                                {decodeURIComponent(i.path.replace("/exhibition-sub/", "")).replace(/-/g, " ").trim()}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {groups.legal.length > 0 && (
                            <section>
                                <h2 className="mb-2 text-xl font-semibold text-black">Legal Pages</h2>
                                <ul className="pl-5 space-y-1 list-disc">
                                    {groups.legal.map((i) => (
                                        <li key={i.path}>
                                            <Link href={i.path} className="text-blue-600 hover:underline">
                                                {i.path === "/privacy" ? "Privacy Policy" : i.path === "/terms" ? "Terms of Service" : i.path}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default HTMLSitemap;
