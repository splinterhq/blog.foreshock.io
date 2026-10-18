export const layout = "layouts/archive.vto";

/** Page size for every paginated list in the blog. */
const PAGE_SIZE = 10;

export default function* ({ search, paginate, i18n }) {
  const posts = search.pages("type=post", "date=desc");

  for (const data of paginate(posts, { url, size: PAGE_SIZE })) {
    yield {
      ...data,
      // Lume's pagination data carries previous/next but not the full list of
      // page urls, so the numbered strip in templates/pagination.vto is built
      // here where the url function is already in scope.
      pageUrls: Array.from(
        { length: data.pagination.totalPages },
        (_, index) => url(index + 1),
      ),
      title: i18n.nav.archive_title,
      subtitle: i18n.nav.archive_subtitle,
    };
  }
}

function url(n) {
  if (n === 1) {
    return "/archive/";
  }

  return `/archive/${n}/`;
}
