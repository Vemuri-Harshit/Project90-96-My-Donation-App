import firebase from 'firebase';
require('@firebase/firestore')

var firebaseConfig = {
  apiKey: "AIzaSyCpKRM_TCRbIekaryhyyzxEU85OL5ME6X0",
  authDomain: "donate-app-15f6a.firebaseapp.com",
  projectId: "donate-app-15f6a",
  storageBucket: "donate-app-15f6a.appspot.com",
  messagingSenderId: "654332675078",
  appId: "1:654332675078:web:87e7cfa1b8311dc55e6f87",
  measurementId: "G-T4TM6VG7SE"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();

  export default firebase.firestore();