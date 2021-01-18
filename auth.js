$(() => {
  var firebaseConfig = {
    apiKey: "AIzaSyBw49-qQaOfusS1ctyBeoZ9vir52bm-eE8",
    authDomain: "final-cda2a.firebaseapp.com",
    databaseURL: "https://final-cda2a-default-rtdb.firebaseio.com",
    projectId: "final-cda2a",
    storageBucket: "final-cda2a.appspot.com",
    messagingSenderId: "125502150967",
    appId: "1:125502150967:web:c0c9bb7cb0990a686722b2",
    measurementId: "G-WWW28G6KKM"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  var newUser = false;
  
  function signIn() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
        if (result.additionalUserInfo.isNewUser == true) {
            newUser = true;
        }
    }).catch(function(error) {
        console.log(error.message);
    });
  }
  
  function signOut() {
    firebase.auth().signOut();
  }
  
  function authStateObserver(user) {
    if (user) { // User is signed in!
        // Get the signed-in user's profile pic and name.
        //var profilePicUrl = getProfilePicUrl();
        //var userName = getUserName();
      console.log("hi")
      $('#test').removeAttr('hidden')
      $('#signInBtn').attr('hidden', 'true')
      $('#signOutBtn').removeAttr('hidden')
        if (newUser == true) {
            saveUserInformation();
            //saveUserMatchData();
        }
        // We save the Firebase Messaging Device token and enable notifications.
        // saveMessagingDeviceToken();
        checkMatchRoom();
    } else { // User is signed out!
        // Hide user's profile and sign-out button.
        $('#test').attr('hidden', 'true')
        $('#signInBtn').removeAttr('hidden')
        $('#signOutBtn').attr('hidden', 'true')
    }
  }
  
  function initFirebaseAuth() {
    firebase.auth().onAuthStateChanged(authStateObserver);
  }
  initFirebaseAuth()
  $('#signInBtn').click(signIn())
  $('#signOutBtn').click(signOut())
})