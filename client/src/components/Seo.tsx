import * as React from "react";

type SeoProps = {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
};

export function Seo({ title, description, ogTitle, ogDescription }: SeoProps) {
  React.useEffect(() => {
    document.title = title;

    const ensureMeta = (nameOrProperty: "name" | "property", key: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(`meta[${nameOrProperty}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(nameOrProperty, key);
        document.head.appendChild(el);
      }
      return el;
    };

    ensureMeta("name", "description").setAttribute("content", description);
    ensureMeta("property", "og:title").setAttribute("content", ogTitle ?? title);
    ensureMeta("property", "og:description").setAttribute("content", ogDescription ?? description);
  }, [title, description, ogTitle, ogDescription]);

  return null;
}
