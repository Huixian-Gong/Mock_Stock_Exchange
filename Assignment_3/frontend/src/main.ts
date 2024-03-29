import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { HttpClientModule } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CustomReuseStrategy } from './app/custom-route-reuse-strategy';
import { RouteReuseStrategy } from '@angular/router';


// enableProdMode();

bootstrapApplication(AppComponent, {
  
  providers: [
    provideRouter(routes),
    HttpClientModule, provideAnimationsAsync(), provideAnimationsAsync(),
    // Other providers...
    {provide: RouteReuseStrategy, useClass: CustomReuseStrategy},

  ],
}).catch(err => console.error(err));

