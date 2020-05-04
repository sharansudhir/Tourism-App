import app from 'firebase/app'

const firebaseConfig = {
  apiKey: "AIzaSyDa36O-ZYT3Yf-hxHPJzcFS795YUxZKVt0",
  authDomain: "tourism-app-c9d28.firebaseapp.com",
  databaseURL: "https://tourism-app-c9d28.firebaseio.com",
  projectId: "tourism-app-c9d28",
  storageBucket: "tourism-app-c9d28.appspot.com",
  messagingSenderId: "32514322038",
  appId: "1:32514322038:web:4cd86b57f013eeff7a3957",
  measurementId: "G-T76ZSH3RX0"
};

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);
    this.auth = app.auth()
  }

  createUser = (email, password, displayName ) =>
    this.auth.createUserWithEmailAndPassword(email, password)
    .then(function(result){
        return result.user.updateProfile({
            displayName: displayName
        })
    }).catch(function(error){
        console.log(error);
    });

  signIn = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  signOut = () =>
    this.auth.signOut();

}

export default Firebase;
