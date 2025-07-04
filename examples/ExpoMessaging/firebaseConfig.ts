import { initializeApp } from 'firebase/app';

// Optionally import the services that you want to use
// import {...} from 'firebase/auth';
// import {...} from 'firebase/database';
// import {...} from 'firebase/firestore';
 import {getFunctions, httpsCallable,} from 'firebase/functions';
// import {...} from 'firebase/storage';
import { getDatabase } from "firebase/database";

// Initialize Firebase
const firebaseConfig = {
 apiKey: "AIzaSyCbztd9f8b5vTz_FWc8j0Y4OhG7_ijK0c4",
  authDomain: "rodolphe-message.firebaseapp.com",
  databaseURL: "https://rodolphe-message-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "rodolphe-message",
  storageBucket: "rodolphe-message.firebasestorage.app",
  messagingSenderId: "206464851267",
  appId: "1:206464851267:web:bda495429b989a316fa3f6",
  measurementId: "G-94FN5RE5VW"
};

export const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);

const functions = getFunctions(app); // initialiser les fonctions pour ton app Firebase
  const myFunction = httpsCallable(functions, 'translateText'); // nom de ta fonction côté server
export const translateText = async (text:string , iso:string):Promise<string> => {
  
    console.log('{ text: text, iso: iso }:', { text: text, iso: iso })

  try {
    const result = await myFunction({ text: text, iso: iso });
    console.log('result:', result.data)
    return result.data.result
    console.log('✅ Réponse de la fonction:', result.data);
  } catch (error) {
    console.error('❌ Erreur lors de l’appel de la fonction:', error);
  }
};
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
