importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// messaging.onBackgroundMessage(function(payload) {
//   console.log('[firebase-messaging-sw.js] Received background message ', payload);

//   let notificationTitle = 'Default Title';
//   let notificationOptions = {
//     body: 'Default Body',
//     icon: '/firebase-logo.png'
//   };

//   if (payload.notification) {
//     notificationTitle = payload.notification.title;
//     notificationOptions.body = payload.notification.body;
//   } else if (payload.data) {
//     notificationTitle = payload.data.title || notificationTitle;
//     notificationOptions.body = payload.data.body || notificationOptions.body;
//   }

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });

messaging.onBackgroundMessage();
