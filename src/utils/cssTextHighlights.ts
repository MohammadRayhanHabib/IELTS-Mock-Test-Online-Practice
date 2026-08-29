export type CssTextHighlightKind = "highlight" | "note";

export interface CssTextHighlightEntry {
  kind: CssTextHighlightKind;
  range: Range;
}

interface HighlightRegistry {
  delete(name: string): boolean;
  set(name: string, highlight: unknown): void;
}

type HighlightConstructor = new (...ranges: Range[]) => unknown;

const getHighlightApi = () => {
  if (typeof window === "undefined" || typeof CSS === "undefined") return null;

  const registry = (CSS as typeof CSS & { highlights?: HighlightRegistry })
    .highlights;
  const HighlightApi = (window as typeof window & {
    Highlight?: HighlightConstructor;
  }).Highlight;

  if (!registry || !HighlightApi) return null;
  return { registry, HighlightApi };
};

export const clearCssTextHighlights = (scope: string) => {
  const api = getHighlightApi();
  if (!api) return;
  api.registry.delete(`${scope}-highlight`);
  api.registry.delete(`${scope}-note`);
};

export const applyCssTextHighlights = (
  scope: string,
  entries: CssTextHighlightEntry[],
) => {
  const api = getHighlightApi();
  if (!api) return false;

  clearCssTextHighlights(scope);
  const HighlightApi = api.HighlightApi;

  (["highlight", "note"] as const).forEach((kind) => {
    const ranges = entries
      .filter((entry) => entry.kind === kind)
      .map((entry) => entry.range)
      .filter(
        (range) =>
          range.startContainer.isConnected && range.endContainer.isConnected,
      );

    if (ranges.length) {
      api.registry.set(`${scope}-${kind}`, new HighlightApi(...ranges));
    }
  });

  return true;
};
