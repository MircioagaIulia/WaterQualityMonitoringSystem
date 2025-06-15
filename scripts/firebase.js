import { initializeApp }   from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig =
{
   "apiKey": "AIzaSyCEz7ce7k7EF_R9TJzi_TdzzJ6llsQRisg",
   "authDomain": "disertatie-b577e.firebaseapp.com",
   "databaseURL": "https://disertatie-b577e-default-rtdb.firebaseio.com",
   "projectId": "disertatie-b577e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { database, app, auth,  onAuthStateChanged, onValue, ref, signInWithEmailAndPassword };
