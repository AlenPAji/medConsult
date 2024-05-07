import { initializeApp } from 'firebase/app';
import {getStorage} from 'firebase/storage'
const firebaseConfig = {
  apiKey: "AIzaSyB2UMIfvU7-Q8215Jg1OZYtEvt4bWTM-dc",
  authDomain: "medconsult-20df5.firebaseapp.com",
  projectId: "medconsult-20df5",
  storageBucket: "medconsult-20df5.appspot.com",
  messagingSenderId: "146878753687",
  appId: "1:146878753687:web:395538ceecdd4b2accb2d2",
  measurementId: "G-C1WFSND0Z9"
};

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

export const storage=getStorage(app)