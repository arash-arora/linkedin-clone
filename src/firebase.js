import { initializeApp } from "firebase/app";
import "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC37Eh8WRY8UeBK1nlgQm5RjCGKMBHX5uc",
  authDomain: "linkedin-96597.firebaseapp.com",
  projectId: "linkedin-96597",
  storageBucket: "linkedin-96597.appspot.com",
  messagingSenderId: "283275920929",
  appId: "1:283275920929:web:24dcefe563e6a945a20560",
  measurementId: "G-NZSDF4PK3X",
};

const firebaseApp = initializeApp(firebaseConfig);

// const db = firebaseApp.firestore();
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();

const storage = getStorage(firebaseApp);

export { auth, provider, storage };
export default db;
