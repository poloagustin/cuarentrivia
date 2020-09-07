import firebase from '../../firebase/get-firebase';

const generateFriendlyName = async (): Promise<string> => {
  const result = await firebase
    .functions()
    .httpsCallable('generateFriendlyName')();
  return result.data as string;
};

export default generateFriendlyName;
