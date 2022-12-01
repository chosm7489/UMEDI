function insertName() {
  firebase.auth().onAuthStateChanged((user) => {
    // Check if a user is signed in:
    if (user) {
      // Do something for the currently logged-in user here:
      user_Name = user.displayName;

      $("#name-goes-here").text(user_Name); //using jquery
    } else {
      // No user is signed in.
    }
  });
}
insertName(); //run the function

function readQuote() {
  db.collection("quotes")
    .doc("friday") //name of the collection and documents should matach excatly with what you have in Firestore
    .onSnapshot((somedoc) => {
      var quoteDiv = document.getElementById("quote-goes-here");
      if (quoteDiv) {
        document.getElementById("quote-goes-here").innerHTML =
          somedoc.data().quote;
      }
    });
}
readQuote(); //calling the function

//------------------------------------------------
// Call this function when the "logout" button is clicked
//-------------------------------------------------
function logout() {
  console.log("logging out user");
  firebase
    .auth()
    .signOut()
    .then(() => {
      // Sign-out successful.
      window.location.href = "../index.html";
    })
    .catch((error) => {
      // An error happened.
    });
}
