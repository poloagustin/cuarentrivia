import firebase from '../../firebase/get-firebase';

export const getDb = (): firebase.firestore.Firestore => firebase.firestore();
