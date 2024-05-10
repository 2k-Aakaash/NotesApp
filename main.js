
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
  import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
  import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "AIzaSyCyhq-xNzrlxMjYx7L8Tdhe6naA2mEoGx4",
    authDomain: "notesapp-13cdd.firebaseapp.com",
    projectId: "notesapp-13cdd",
    storageBucket: "notesapp-13cdd.appspot.com",
    messagingSenderId: "1098672014727",
    appId: "1:1098672014727:web:a164fdf6ae2b95978c7f22",
    measurementId: "G-DS5CSQP0MD"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app); 
  const auth = getAuth(app);
  auth.languageCode = 'en'
  const provider = new GoogleAuthProvider();

  function updateUserProfile (user) {
    const userName = user.displayName;
    const userEmail = user.email;
    const userProfilePicture = user.photoURL;
    console.log(userEmail)

    document.getElementById("userName").textContent = 'userName'
    document.getElementById("userEmail").textContent = 'userEmail'
    document.getElementById("userProfilePicture").src = 'userProfilePicture'

  }

  const googleLogin = document.getElementById('google-login-btn')
  googleLogin.addEventListener("click", function(){
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const user = result.user;
        console.log(user);
        window.location.href = "logged.html"

      }).catch((error) => {

    const errorCode = error.code;
    const errorMessage = error.message;

  });
  })

  updateUserProfile()

  onAuthStateChanged(auth, (user) => {
    if(user){
      updateUserProfile(user);
      const uid = user.uid;
      return uid;
    } else {
      alert("Create Account & Login")
    }
  })