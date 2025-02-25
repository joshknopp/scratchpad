import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AppComponent } from './app.component';
import { AuthModule, OidcConfigService, AuthWellKnownEndpoints } from 'angular-auth-oidc-client';
import { DynamicOidcConfigService } from './dynamic-oidc-config.service';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';

export function configureAuth(oidcConfigService: OidcConfigService, dynamicConfigService: DynamicOidcConfigService) {
    return () =>
        oidcConfigService.withConfig(dynamicConfigService.getConfig()).pipe(
          (config) => {
            const wellKnownEndpoints: AuthWellKnownEndpoints = {
              issuer: config.config.authority,
              jwksUri: `${config.config.authority}/.well-known/openid-configuration/jwks`,
              authorizationEndpoint: `${config.config.authority}/authorize`,
              tokenEndpoint: `${config.config.authority}/oauth/token`,
              userinfoEndpoint: `${config.config.authority}/userinfo`,
              endSessionEndpoint: `${config.config.authority}/logout`
            };
            return of({config, wellKnownEndpoints});
          }
        ).toPromise();
}

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, AuthModule.forRoot({
      config: {
        authority: '', // this will be overwritten by the APP_INITIALIZER
        redirectUrl: window.location.origin,
        postLogoutRedirectUri: window.location.origin,
        clientId: '',
        scope: 'openid profile email',
        responseType: 'code',
        silentRenew: true,
        useRefreshToken: true,
      }
    }), HttpClientModule],
    providers: [
        DynamicOidcConfigService,
        {
            provide: APP_INITIALIZER,
            useFactory: configureAuth,
            deps: [OidcConfigService, DynamicOidcConfigService],
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
