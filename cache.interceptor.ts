import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Check if the request method is GET
    if (request.method !== 'GET') {
      // Pass through non-GET requests
      return next.handle(request);
    }

    // Check if the request URL is cached
    const cachedResponse = this.cache.get(request.url);
    if (cachedResponse) {
      // Check if the cached data is still fresh (e.g., within 15 minutes)
      const currentTime = new Date().getTime();
      if (currentTime - cachedResponse.timestamp < 15 * 60 * 1000) {
        // Return cached data
        return of(cachedResponse.data);
      } else {
        // Remove stale cached data
        this.cache.delete(request.url);
      }
    }

    // If not cached or stale, make the request and cache the response
    return next.handle(request).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          this.cache.set(request.url, {
            data: event.body,
            timestamp: new Date().getTime(),
          });
        }
      })
    );
  }
}
