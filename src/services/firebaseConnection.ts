
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyAqXePpMiAu-ZUfytepO-E2zqEDMfTa72E",
  authDomain: "webcarros-de4c0.firebaseapp.com",
  projectId: "webcarros-de4c0",
  storageBucket: "webcarros-de4c0.appspot.com",
  messagingSenderId: "945350040441",
  appId: "1:945350040441:web:25e7b7b7327b2268226da8"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };