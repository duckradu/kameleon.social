import { useLocation } from "@solidjs/router";
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

export function createInfiniteScroll<C, S>(
  fetcher: (source: S) => Promise<C[]>,
  config: {
    initialSource: S;

    getNextSource: (accessors: {
      content: Accessor<C[]>;
      source: Accessor<S>;
    }) => S;
  }
): [
  content: Accessor<C[]>,
  loader: (el: Element) => void,
  options: {
    setContent: Setter<C[]>;
    source: Accessor<S>;
    setSource: Setter<S>;
    end: Accessor<boolean>;
    setEnd: Setter<boolean>;
  }
] {
  const location = useLocation();

  const [content, setContent] = createSignal<C[]>([]);
  const [source, setSource] = createSignal<S>(
    config.getNextSource({
      content,
      source: () => config.initialSource,
    })
  );
  const [end, setEnd] = createSignal(false);

  let add: (el: Element) => void = noop;

  if (!isServer) {
    const io = new IntersectionObserver((e) => {
      if (e.length > 0 && e[0].isIntersecting && !end() && !contents.loading) {
        setSource(() => config.getNextSource({ content, source }));
      }
    });

    onCleanup(() => {
      io.disconnect();
    });

    add = (el: Element) => {
      io.observe(el);

      tryOnCleanup(() => io.unobserve(el));
    };
  }

  const [contents] = createResource(source, fetcher);

  createComputed(() => {
    const content = contents.latest;

    if (!content) {
      return;
    }

    batch(() => {
      if (content.length === 0) {
        setEnd(true);
      }

      setContent((p) => [...p, ...content]);
    });
  });

  createComputed((prevPathname) => {
    if (prevPathname && prevPathname !== location.pathname) {
      batch(() => {
        setContent([]);
        setEnd(false);

        setSource(() => config.getNextSource({ content, source }));
      });
    }

    return location.pathname;
  });

  return [content, add, { setContent, source, setSource, end, setEnd }];
}
