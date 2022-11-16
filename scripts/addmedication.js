function addMedInfo() {
    console.log("add your new medication");

    let Name = document.getElementById("nameAddInput").value;
    let Code = document.getElementById("codeAddInput").value;
    let Intake = document.getElementById("intakeAddInput").value;
    let Details = document.getElementById("detailsAddInput").value;

    console.log(Name, Code, Intake, Details);

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var currentUser = db.collection("users").doc(user.uid)
            var userID = user.uid;
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    // var userEmail = userDoc.data().email;
                    db.collection("medications").add({
                        name: Name,
                        code: Code,
                        userID: userID,
                        intake: Intake,
                        details: Details,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp()
                    }).then(()=>{
                        window.location.href = "result.html"; //new line added
                    })
                })
        } else {
            // No user is signed in.
        }
    });
}