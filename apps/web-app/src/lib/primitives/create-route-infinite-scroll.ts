import { Params, useLocation } from "@solidjs/router";
import { Accessor, batch, createComputed, createSignal } from "solid-js";

import { createInfiniteScroll } from "./create-infinite-scroll";

export function createRouteInfiniteScroll<T, S, P = Params>(
  fetcher: (source: S) => Promise<T[]>,
  getNextSourceValue: (
    pages?: Accessor<T[]>,
    params?: P,
    currentSourceValue?: S
  ) => S,
  routeParams: P
) {
  const location = useLocation();
  const [prevPathname, setPrevPathname] = createSignal(location.pathname);

  const infiniteScroll = createInfiniteScroll(
    fetcher,
    (pages, currentSourceValue) =>
      getNextSourceValue(pages, routeParams, currentSourceValue as any)
  );

  const [pages, , { setSource, setPages, setEnd }] = infiniteScroll;

  createComputed(() => {
    let isSamePathname = true;

    if (prevPathname() !== location.pathname) {
      isSamePathname = false;

      setPrevPathname(location.pathname);
    }

    if (!isSamePathname) {
      batch(() => {
        setPages([]);
        setEnd(false);

        setSource(() => getNextSourceValue(pages, routeParams, "" as any));
      });
    }
  });

  return infiniteScroll;
}
