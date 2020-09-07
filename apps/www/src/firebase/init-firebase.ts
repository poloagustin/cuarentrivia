import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import { environment } from '../environments/environment';

const initFirebase = () => {
  return firebase.initializeApp(environment.firebase);
};

export default initFirebase;
