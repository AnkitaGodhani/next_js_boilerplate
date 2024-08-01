import { useEffect, useState } from "react";
import { NextRouter, useRouter } from "next/router";
import { getRouteRegex } from "next/dist/shared/lib/router/utils/route-regex";
import { getClientBuildManifest } from "next/dist/client/route-loader";
import { parseRelativeUrl } from "next/dist/shared/lib/router/utils/parse-relative-url";
import { isDynamicRoute } from "next/dist/shared/lib/router/utils/is-dynamic";
import { removeTrailingSlash } from "next/dist/shared/lib/router/utils/remove-trailing-slash";

async function getPageList(): Promise<string[]> {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    // In development
    if (typeof window !== "undefined" && window.__BUILD_MANIFEST?.sortedPages) {
      return window.__BUILD_MANIFEST.sortedPages;
    }
  } else {
    // In production
    const { sortedPages } = await getClientBuildManifest();
    return sortedPages;
  }
  return [];
}

async function getDoesLocationMatchPage(location: string): Promise<boolean> {
  const pages = await getPageList();
  let parsed = parseRelativeUrl(location);
  let { pathname } = parsed;
  return pathMatchesPage(pathname, pages);
}

function pathMatchesPage(pathname: string, pages: string[]): boolean {
  const cleanPathname = removeTrailingSlash(pathname);

  if (pages.includes(cleanPathname)) {
    return true;
  }

  const page = pages.find(
    (page) => isDynamicRoute(page) && getRouteRegex(page).re.test(cleanPathname)
  );

  if (page) {
    return true;
  }
  return false;
}

function doesNeedsProcessing(router: NextRouter): boolean {
  const status = router.pathname !== router.asPath;
  return status;
}

export function usePageFound(): boolean {
  const router = useRouter();
  const [isPageFound, setIsPageFound] = useState<boolean>(true);

  useEffect(() => {
    const processLocation = async () => {
      if (router.isReady && doesNeedsProcessing(router)) {
        const pageFound = await getDoesLocationMatchPage(router.asPath);
        setIsPageFound(pageFound);
      }
    };

    processLocation();
  }, [router.isReady, router.asPath]);

  return isPageFound;
}
