export const layout = "layouts/archive_result.vto";

/** Page size for every paginated list in the blog. */
const PAGE_SIZE = 10;

/** Tags and authors become URL segments, so they get slugged. A tag is free
 *  text: without this, "Concept geometry" would become a URL with a space in
 *  it. Lookups by value are unaffected — only the URL changes. */
function slug(value) {
  return String(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/** The urls of every page of a result set. See archive.page.js for why this
 *  is not coming from Lume. */
function pageUrls(totalPages, url) {
  return Array.from({ length: totalPages }, (_, index) => url(index + 1));
}

export default function* ({ search, i18n, paginate }) {
  // Generate a paginated page for each tag
  for (const tag of search.values("tags")) {
    const url = (n) =>
      (n === 1) ? `/archive/${slug(tag)}/` : `/archive/${slug(tag)}/${n}/`;
    const posts = search.pages(`type=post '${tag}'`, "date=desc");

    for (const page of paginate(posts, { url, size: PAGE_SIZE })) {
      yield {
        ...page,
        pageUrls: pageUrls(page.pagination.totalPages, url),
        title: `${i18n.search.by_tag} “${tag}”`,
        type: "tag",
        tag,
      };
    }
  }

  // Generate a paginated page for each author
  for (const author of search.values("author")) {
    const url = (n) =>
      (n === 1) ? `/author/${slug(author)}/` : `/author/${slug(author)}/${n}/`;
    const posts = search.pages(`type=post author='${author}'`, "date=desc");

    for (const page of paginate(posts, { url, size: PAGE_SIZE })) {
      yield {
        ...page,
        pageUrls: pageUrls(page.pagination.totalPages, url),
        title: `${i18n.search.by_author} ${author}`,
        type: "author",
        author,
      };
    }
  }
}
