// Please add this file to .gitignore and have this for your own files.

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDlYm5L3WREpGEG-2_k66JRMfFe6CsuU3I",
  authDomain: "comp1800---term-project.firebaseapp.com",
  projectId: "comp1800---term-project",
  storageBucket: "comp1800---term-project.appspot.com",
  messagingSenderId: "267027097654",
  appId: "1:267027097654:web:42f4bb3b0966eb15c4d097"
  };

  // Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();