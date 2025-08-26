// firebase-init.js

// Your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAI7XhQbo08cEP_YFtmmjr7Z4Bj50bRaMg",
  authDomain: "starlab-adventure.firebaseapp.com",
  projectId: "starlab-adventure",
  storageBucket: "starlab-adventure.firebasestorage.app",
  messagingSenderId: "550598361567",
  appId: "1:550598361567:web:2a99e97d63ad3406aec46a",
  measurementId: "G-5P05SX2MKM"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.auth();
firebase.firestore();
