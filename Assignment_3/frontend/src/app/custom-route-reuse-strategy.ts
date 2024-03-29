import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

export class CustomReuseStrategy implements RouteReuseStrategy {
  storedRoutes: { [key: string]: DetachedRouteHandle } = {};

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    // Assuming you want to cache all routes except for 'watchlist' and 'portfolio'
    return !(route.routeConfig?.path === 'watchlist' || route.routeConfig?.path === 'portfolio');
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
    // Use a composite key for dynamic routes to ensure uniqueness
    const path = this.getPath(route);
    if (path && handle) {
      this.storedRoutes[path] = handle;
    }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const path = this.getPath(route);
    return !!path && !!this.storedRoutes[path];
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    const path = this.getPath(route);
    if (path) {
      return this.storedRoutes[path] || null;
    }
    return null;
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }

  private getPath(route: ActivatedRouteSnapshot): string | null {
    if (route.routeConfig?.path) {
      // Include parameters to handle dynamic routes
      const paramsKey = Object.keys(route.params).map(key => route.params[key]).join('_');
      return route.routeConfig.path + (paramsKey ? `_${paramsKey}` : '');
    }
    return null;
  }
}
