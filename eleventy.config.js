// Eleventy configuration for balmtherapeutics.com.ng
export default function (eleventyConfig) {
  // Files copied to the site as they are
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });
  eleventyConfig.addPassthroughCopy({ "src/_headers": "_headers" });
  eleventyConfig.addPassthroughCopy({ "src/_redirects": "_redirects" });

  eleventyConfig.ignores.add("src/admin/**");

  // Collections
  eleventyConfig.addCollection("services", (api) =>
    api.getFilteredByGlob("src/services/*.md").sort((a, b) => (a.data.order || 99) - (b.data.order || 99))
  );
  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByGlob("src/blog/*.md").filter((p) => !p.data.draft).sort((a, b) => b.date - a.date)
  );
  eleventyConfig.addCollection("events", (api) =>
    api.getFilteredByGlob("src/events/*.md").sort((a, b) => new Date(a.data.start) - new Date(b.data.start))
  );
  eleventyConfig.addCollection("team", (api) =>
    api.getFilteredByGlob("src/team/*.md").sort((a, b) => (a.data.order || 99) - (b.data.order || 99))
  );

  // Events: split into upcoming and past at build time.
  // Cloudflare rebuilds the site daily (see README), so past events move to the archive on their own.
  const today = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  };
  eleventyConfig.addFilter("upcoming", (events) => (events || []).filter((e) => new Date(e.data.end || e.data.start) >= today()));
  eleventyConfig.addFilter("past", (events) => (events || []).filter((e) => new Date(e.data.end || e.data.start) < today()).reverse());

  // Dates, formatted for Nigeria
  const fmt = (d, opts) => new Date(d).toLocaleDateString("en-GB", { timeZone: "Africa/Lagos", ...opts });
  eleventyConfig.addFilter("longDate", (d) => fmt(d, { day: "numeric", month: "long", year: "numeric" }));
  eleventyConfig.addFilter("day", (d) => fmt(d, { day: "2-digit" }));
  eleventyConfig.addFilter("mon", (d) => fmt(d, { month: "short" }));
  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString().slice(0, 10));
  eleventyConfig.addFilter("year", () => new Date().getFullYear());

  // Small helpers
  eleventyConfig.addFilter("limit", (arr, n) => (arr || []).slice(0, n));
  eleventyConfig.addFilter("wa", (text, number) => "https://wa.me/" + number + "?text=" + encodeURIComponent(text));
  eleventyConfig.addFilter("bySlugs", (items, slugs) => (slugs || []).map((s) => (items || []).find((i) => i.fileSlug === s)).filter(Boolean));
  eleventyConfig.addFilter("withArea", (people, area) => (people || []).filter((p) => (p.data.areas || []).includes(area)));
  eleventyConfig.addFilter("json", (v) => JSON.stringify(v));
  eleventyConfig.addFilter("finderKeys", (slug, finder) => (finder || []).filter((f) => f.picks.includes(slug)).map((f) => f.id).join(" "));
  eleventyConfig.addFilter("areaKeys", (areas) => (areas || []).join(" "));

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
