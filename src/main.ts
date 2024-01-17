import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { importProvidersFrom } from '@angular/core';
import { IonicModule } from '@ionic/angular';


if (environment.production) {
  enableProdMode();
}

const app = initializeApp(environment.firebaseConfig);
getAnalytics(app);

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(IonicModule.forRoot()),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes),
  ],
});
