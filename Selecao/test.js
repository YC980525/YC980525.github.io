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
    
   
    // Insertion
    $('#insert').click(() => {
        let nameV = $("#namebox").val()
        let rollV = $("#rollbox").val()
        firebase.database().ref('student/'+rollV).set({
            NameOfStudent: nameV,
            RollNo: rollV,
        })
        
    })
 
})

