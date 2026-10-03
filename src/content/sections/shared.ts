import { textarea } from "../fields";

/** Per-page search description — rendered into the page's <meta>. */
export const metaDescription = (value: string) =>
  textarea("Search description", value, {
    max: 300,
    help: "What Google shows under this page's title. Aim for 150–160 characters.",
  });
