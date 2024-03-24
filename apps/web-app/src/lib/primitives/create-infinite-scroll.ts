import {
  Accessor,
  DEV,
  Setter,
  batch,
  createComputed,
  createResource,
  createSignal,
  getOwner,
  onCleanup,
} from "solid-js";
import { isServer } from "solid-js/web";

import { noop } from "~/lib/utils/common";

export const isClient = !isServer;
export const isDev = isClient && !!DEV;

export const tryOnCleanup: typeof onCleanup = isDev
  ? (fn) => (getOwner() ? onCleanup(fn) : fn)
  : onCleanup;

export function createInfiniteScroll<T, C extends number | string>(
  fetcher: (cursor: C) => Promise<T[]>,
  getNextCursorValue: (pages: Accessor<T[]>, cursorValue?: C) => C
): [
  pages: Accessor<T[]>,
  loader: (el: Element) => void,
  options: {
    cursor: Accessor<C>;
    setCursor: Setter<C>;
    setPages: Setter<T[]>;
    end: Accessor<boolean>;
    setEnd: Setter<boolean>;
  }
] {
  const [pages, setPages] = createSignal<T[]>([]);
  const [cursor, setCursor] = createSignal<C>(getNextCursorValue(pages));
  const [end, setEnd] = createSignal(false);

  let add: (el: Element) => void = noop;
  if (!isServer) {
    const io = new IntersectionObserver((e) => {
      if (e.length > 0 && e[0]!.isIntersecting && !end() && !contents.loading) {
        setCursor((p) => getNextCursorValue(pages, p));
      }
    });
    onCleanup(() => io.disconnect());
    add = (el: Element) => {
      io.observe(el);
      tryOnCleanup(() => io.unobserve(el));
    };
  }

  const [contents] = createResource(cursor, fetcher);

  createComputed(() => {
    const content = contents.latest;
    if (!content) return;
    batch(() => {
      if (content.length === 0) setEnd(true);
      setPages((p) => [...p, ...content]);
    });
  });

  return [
    pages,
    add,
    {
      cursor: cursor,
      setCursor: setCursor,
      setPages: setPages,
      end: end,
      setEnd: setEnd,
    },
  ];
}
