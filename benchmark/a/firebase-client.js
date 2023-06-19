/**
 * 원본 소스 room-ent 프로젝트
 * 변경시 room-ent > fcm 에서 변경 해야 함.
 *
 * firebase client script
 */
function FirebaseClient(obj) {
  /**
   * sendTokenToServer
   * @param token
   */
  function sendTokenToServer(token) {
    const data = {
      device: {
        token: token,
        deviceID: obj.email,
        name: obj.name,
        type: 'web'
      }
    };

    // Ajax
    const url = obj.apiDomain + '/device/register';
    const authHeaderStr = localStorage.getItem('authorizationKey');
    const reqOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeaderStr
      },
      body: JSON.stringify(data)
    };

    fetch(url, reqOptions)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        if (data.returnCode === '40100') {
          console.log('Success resister Firebase Token');
        } else {
          console.log('Failed resister Firebase Token', data);
        }
      });
  }

  /**
   * init
   */
  function init() {
    // Initialize Firebase
    // https://console.firebase.google.com/project/remotemeeting-1022/settings/general/android:com.rsupport.remotemeeting.application
    // firebase.initializeApp({
    //   apiKey: 'AIzaSyAWedPIc7P_EHS3zeyqLVSD4nOsKLqSAug', // required
    //   authDomain: 'remotemeeting-1022.firebaseapp.com',
    //   databaseURL: 'https://remotemeeting-1022.firebaseio.com',
    //   projectId: 'remotemeeting-1022',
    //   storageBucket: 'remotemeeting-1022.appspot.com',
    //   messagingSenderId: '656924295991' // required
    // });

    // 2.13.x에서 firebase 정보 변경됨
    firebase.initializeApp({
      apiKey:
        'AAAAEmENeFw:APA91bFeoMUxj3CfnkhBBYi2qlquJ5Giad5QqReVamiYay1hO7V2egeG2_W-V8QGFUda7JfK8iz3vZSslnDyY8tu_n_5T7kXNs8TFZWVqLO8jbZa7CyVID_OY1Pl47BtHKu8GTpH7etH', // required
      authDomain: 'remotemeeting-ce6be.firebaseapp.com',
      databaseURL: 'https://remotemeeting-ce6be.firebaseio.com',
      projectId: 'remotemeeting-ce6be',
      storageBucket: 'remotemeeting-ce6be.appspot.com',
      messagingSenderId: '78937684060' // required
    });
    const messaging = firebase.messaging();
    let swURL = `/public/common/fcm/firebase-messaging-sw.js`;

    if (obj.swURL) {
      swURL = obj.swURL;
    }

    // change firebase-messaging-sw.js path
    // default http://www.domain.com/firebase-messaging-sw.js
    // edge 17버전 부터 지원 https://developer.mozilla.org/en-US/docs/Web/API/Navigator/serviceWorker
    try {
      if (navigator.serviceWorker) {
        navigator.serviceWorker.register(swURL).then((registration) => {
          messaging.useServiceWorker(registration);

          messaging
            .requestPermission()
            .then(function() {
              console.log('Have permission');
              return messaging.getToken();
            })
            .then(function(token) {
              console.log('Firebase Token', token);
              sendTokenToServer(token);
            })
            .catch(function(err) {
              console.log('Firebase Error', err);
            });
        });

        messaging.onMessage((payload) => {
          obj && obj.onMessage(payload.data);
        });
      }
    } catch (error) {
      console.error('serviceWorker error', error);
    }
  }
  init();

  /**
   * unregister (https://stackoverflow.com/questions/33704791/how-do-i-uninstall-a-service-worker)
   * unregister service worker
   */
  this.unregister = function() {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (let registration of registrations) {
        registration.unregister();
      }
    });
  };
}
