import { IRoute } from "types/navigation";

// NextJS Requirement
export const isWindowAvailable = () => typeof window !== "undefined";

/**
 * Finds the route that best matches the pathname. The longest matching path
 * wins, so `/portal/wallet/transactions` resolves to Transaction History
 * rather than Wallet.
 */
export const findCurrentRoute = (routes: IRoute[], pathname?: string): IRoute => {
  const current =
    pathname ?? (isWindowAvailable() ? window.location.pathname : "");
  return routes
    .filter((route) => {
      const full = route.layout + route.path;
      return full.endsWith("/")
        ? current.startsWith(full)
        : current === full || current.startsWith(full + "/");
    })
    .sort((a, b) => b.path.length - a.path.length)[0];
};

export const getActiveRoute = (routes: IRoute[], pathname?: string): string => {
  const route = findCurrentRoute(routes, pathname);
  return route?.name || "Patient Portal";
};

export const getActiveNavbar = (routes: IRoute[], pathname?: string): boolean => {
  const route = findCurrentRoute(routes, pathname);
  return route?.secondary;
};

export const getActiveNavbarText = (
  routes: IRoute[],
  pathname?: string,
): string | boolean => {
  return getActiveRoute(routes, pathname) || false;
};
