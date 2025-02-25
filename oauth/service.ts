import { Injectable } from '@angular/core';
import { AuthConfig } from 'angular-auth-oidc-client';

@Injectable({
  providedIn: 'root',
})
export class DynamicOidcConfigService {
  getConfig(): AuthConfig {
    const currentUrl = window.location.origin; // Get the base URL

    let authority = 'https://your-default-authority';
    let clientId = 'your-default-client-id';
    let redirectUrl = `${currentUrl}/callback`; // Default callback

    // Dynamic logic based on URL
    if (currentUrl.includes('dev')) {
      authority = 'https://dev-authority';
      clientId = 'dev-client-id';
      redirectUrl = `${currentUrl}/dev-callback`;
    } else if (currentUrl.includes('staging')) {
      authority = 'https://staging-authority';
      clientId = 'staging-client-id';
      redirectUrl = `${currentUrl}/staging-callback`;
    } else if (currentUrl.includes('production')){
      authority = 'https://production-authority';
      clientId = 'production-client-id';
      redirectUrl = `${currentUrl}/callback`;
    }
    // ... more dynamic logic based on your needs

    return {
      authority: authority,
      clientId: clientId,
      redirectUrl: redirectUrl,
      responseType: 'code',
      scope: 'openid profile email',
      postLogoutRedirectUri: currentUrl, // or other logic
      // ... other static configurations
    };
  }
}
