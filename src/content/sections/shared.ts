import { text, textarea } from "../fields";

/** Per-page browser-tab and search-result title. The site name is appended. */
export const metaTitle = (value: string) =>
  text("Page title (browser tab)", value, {
    max: 60,
    help: "Shown in the browser tab and as the headline in Google. \"| Brahmas Management and Investment Group\" is added automatically.",
  });

/** Per-page search description — rendered into the page's <meta>. */
export const metaDescription = (value: string) =>
  textarea("Search description", value, {
    max: 300,
    help: "What Google shows under this page's title. Aim for 150–160 characters.",
  });
