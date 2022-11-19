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
            var storageRef = storage.ref("images/" + Code + ".jpg");
            console.log(storageRef);
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
            
                storageRef.put(ImageFile)
                .then(function () {
                    console.log('Uploaded to Cloud Storage.');
    
                    //Asynch call to get URL from Cloud
                    storageRef.getDownloadURL()
    
                        //Asynch call to save the form fields into Firestore.
                        db.collection("medications").doc(user.uid).update({
                                profilePic: url // Save the URL into users collection
                            })
                            .then(function () {
                                console.log('Added Profile Pic URL to Firestore.');
                                console.log('Saved use profile info');
                                document.getElementById('personalInfoFields').disabled = true;
                            })
                    })
            
        } else {
            // No user is signed in.
        }
    });
}

var ImageFile;      //global variable to store the File Object reference

function chooseFileListener(){
    const fileInput = document.getElementById("mypic-input");   // pointer #1
    const image = document.getElementById("mypic-goes-here");   // pointer #2

    //attach listener to input file
    //when this file changes, do something
    fileInput.addEventListener('change', function(e){

        //the change event returns a file "e.target.files[0]"
	      ImageFile = e.target.files[0];
        var blob = URL.createObjectURL(ImageFile);

        //change the DOM img element source to point to this file
        image.src = blob;    //assign the "src" property of the "img" tag
    })
}
chooseFileListener();