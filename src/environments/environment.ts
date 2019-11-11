// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'firebase_api_key_here',
    authDomain: 'kadachepta-app.firebaseapp.com',
    databaseURL: 'https://kadachepta-app.firebaseio.com',
    projectId: 'kadachepta-app',
    storageBucket: 'kadachepta-app.appspot.com',
    messagingSenderId: '874870342380',
    appId: '1:874870342380:web:da6fb393c0a55cd96d9bc9',
    measurementId: 'G-GDTSXCB5YY'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
