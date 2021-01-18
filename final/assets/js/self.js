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
  }
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig)
  
  var totalExpense = 0
  var totalIncome = 0
  var balance = 0
  var numberOfData = 0
  var currentUID = ''

  function authStateObserver(user) {
    if (user) { // sign in
      console.log("hi")

      currentUID = firebase.auth().currentUser.uid
      $('#test').removeAttr('hidden')
      $('#signInBtn').attr('hidden', 'true')
      $('#signOutBtn').removeAttr('hidden')
      $('#detail').removeAttr('hidden') 
      $('#addTrans').removeAttr('hidden')
      
      let ref = firebase.database().ref();
      ref.once("value")
      .then(function(snapshot) {
        let oldUser = snapshot.hasChild(currentUID)
        if (!oldUser) {
          console.log(currentUID)
          console.log('new')
          firebase.database().ref(currentUID).set({
            totalExpense: 0,
            totalIncome:0
          })
        }
      })

      
        // Print data
        console.log(currentUID)
        console.log("start")
        var query = firebase.database().ref(currentUID)
        query.once("value").then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
        var key = childSnapshot.key


      if (key == "totalExpense") {
        totalExpense = parseInt(childSnapshot.val())
        $("#expense").text(totalExpense)
      } else if (key == "totalIncome") {
        totalIncome = parseInt(childSnapshot.val())
        $("#income").text(totalIncome)
      } else {
        $("#overview").after("<div class='detail-container' id='dummy'></div>")
        
        $("#dummy").append("<div class='modal-header'><h5 class='modal-title sub-title'>" + key + "</h5></div><div class='modal-body'><div class='alert sub-detail' id="+key+ "></div></div>")
        $("#dummy").removeAttr("id")
        childSnapshot.forEach((grandChild) =>{
          let grandChildKey = grandChild.key
          let grandChildAmount = grandChild.val()
          let tag = "#" + key
          $(tag).append("<div class='input-group mb-3 label' id="+numberOfData+"><div class='detail-font' style='margin-right: auto;'id='Category'>" + grandChildKey + "</div><div id="+key+grandChildKey+">" + grandChildAmount +"</div></div>")
          
          
          // Deletion

          let dummyTag = "#" + numberOfData
          
          $(document).on("click", dummyTag, () => {
            let detailTag = "#" +key+grandChildKey
            let type = $(dummyTag).children("#Category").text()
            let changeOfAmount = parseInt($(dummyTag).children(detailTag).text())
            
            if (type != "Income") {
              totalExpense -= changeOfAmount
              balance += changeOfAmount
              console.log(key)
              firebase.database().ref(currentUID + '/' + key +'/'+ type).remove()
              firebase.database().ref(currentUID).update({totalExpense: totalExpense})
        
              $("#expense").text(totalExpense)
            }

            else {
              totalIncome -= changeOfAmount
              balance -= changeOfAmount
              console.log(key)
              firebase.database().ref(currentUID + '/' + key +'/'+ type).remove()
              firebase.database().ref(currentUID).update({totalIncome: totalIncome})
        
              $("#income").text(totalIncome)
            }
            $("#balance").text(balance)
            console.log($(dummyTag).children("#Category").text())



            console.log(detailTag)
            console.log($(dummyTag).children(detailTag).text())

            if ($(dummyTag).parent().children().length == 1) {
              $(dummyTag).parent().parent().parent().remove()
            }

            $(dummyTag).remove()
          })

          numberOfData++
        })
      }
      
      });
      balance = totalIncome - totalExpense
      
      $("#balance").text(balance)
    });
      
      

    } else { // signed out
        $('#test').attr('hidden', 'true')
        $('#signInBtn').removeAttr('hidden')
        $('#signOutBtn').attr('hidden', 'true')
        $("#detail > *:not('#overview')").remove()
        $('#detail').attr('hidden', 'true')
        $('#addTrans').attr('hidden', 'true') 
      
    }
  }

  function initFirebaseAuth() {
    firebase.auth().onAuthStateChanged(authStateObserver);
  }
  initFirebaseAuth()

  $('#signInBtn').click(() => {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
        if (result.additionalUserInfo.isNewUser == true) {
          newUser = true;
          
          console.log(true)
        }
    }).catch(function(error) {
        console.log(error.message);
    });  
  })

  $('#signOutBtn').click(() => {
    firebase.auth().signOut();
  })

  // Insertion
  $('#save').click(() => {
    var e = document.getElementById("category");
    var category = e.options[e.selectedIndex].text;
    let amount = parseInt($("#amount").val())
    let date = $("#date").val()
    
    if (category == "Category" || amount == ""  || date == "") {
      alert("Insert the details")
    }

    else {

      
      //console.log(date)
      let dateTag = "#" + date
      let detailTag = "#" + date + category

      if ($(dateTag).length != 0 && $(detailTag).length == 0)  {
        
        $(dateTag).append("<div class='input-group mb-3 label'id="+numberOfData+"><div class='detail-font' style='margin-right: auto;' id='Category'>" + category + "</div><div id="+ date + category+">" + amount + "</div></div>") 
        firebase.database().ref(currentUID + '/' + date).child(category).set(amount)
        
      }
      else if ($(dateTag).length != 0 && $(detailTag).length != 0){
        let originalAmount = parseInt($(detailTag).text())
        let newAmount = amount + originalAmount
        firebase.database().ref(currentUID + '/' + date).child(category).set(newAmount)
        $(detailTag).text(newAmount)
      }

      else if ($(dateTag).length == 0) {

        $("#overview").after("<div class='detail-container' id='dummy'></div>")
        $("#dummy").append("<div class='modal-header'><h5 class='modal-title sub-title'>" + date + "</h5></div><div class='modal-body'><div class='alert sub-detail' id="+date+"></div></div>")
        $("#dummy").removeAttr("id")

        $(dateTag).append("<div class='input-group mb-3 label'id="+numberOfData+"><div class='detail-font' style='margin-right: auto;' id='Category'>" + category + "</div><div id="+ date + category+">" + amount + "</div></div>") 
        firebase.database().ref(currentUID + '/' + date).child(category).set(amount)  
      }

      if (category != "Income") {
        totalExpense += amount
        balance -= amount

        firebase.database().ref(currentUID).update({totalExpense: totalExpense})
        
        $("#expense").text(totalExpense)
      }

      else {
        totalIncome += amount
        balance += amount

        firebase.database().ref(currentUID).update({totalIncome: totalIncome})
        $("#income").text(totalIncome)  
      }
      $("#balance").text(balance)
      $('#category').val("0")
      $('#amount').val("")
      $("#close").click();
    }
    
    // Deletion
          
    let dummyTag = "#" + numberOfData
    
    $(document).on("click", dummyTag, () => {
      let detailTag = "#" +date+category
      let type = $(dummyTag).children("#Category").text()
      let changeOfAmount = parseInt($(detailTag).text())
      if (type != "Income") {
        
        totalExpense -= changeOfAmount
        balance += changeOfAmount
        //console.log(totalExpense)
        firebase.database().ref(currentUID + '/'+ date +'/'+ type).remove()
        firebase.database().ref(currentUID).update({totalExpense: totalExpense})
        //console.log(dummyTag)
        $("#expense").text(totalExpense)
      }

      else {
        totalIncome -= changeOfAmount
        balance -= changeOfAmount
        firebase.database().ref(currentUID + '/'+ date +'/'+ type).remove()
        firebase.database().ref(currentUID).update({totalIncome: totalIncome})
  
        $("#income").text(totalIncome)
      }
      $("#balance").text(balance)

      if ($(dummyTag).parent().children().length == 1) {
        $(dummyTag).parent().parent().parent().remove()
      }

      $(dummyTag).remove()

    })
    numberOfData++
  })
  
  
}) 
