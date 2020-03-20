// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { name, version } from '../../package.json';

export const environment = {
  production: false,
  serviceUrl: '',
  firebase: {
    apiKey: "AIzaSyClV8ZL-Pd-tWEoM7dy7BZOUi-4lI1gO3w",
    authDomain: "tbdi-1533558054559.firebaseapp.com",
    databaseURL: "https://tbdi-1533558054559.firebaseio.com",
    projectId: "tbdi-1533558054559",
    storageBucket: "tbdi-1533558054559.appspot.com",
    messagingSenderId: "475612045706",
    appId: "1:475612045706:web:fa39b9b6dbf821e4692873",
    measurementId: "G-F1R7WXH1BZ"
  }
};

export const v = version;

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
