var ImageFile;   //global variable pointing to the picked file

function chooseFileListener() {
    const fileInput = document.getElementById("mypic-input"); // pointer #1
    const image = document.getElementById("mypic-goes-here"); // pointer #2

    //attach listener to input file
    //when this file changes, do something
    fileInput.addEventListener('change', function (e) {

        //the change event returns a file "e.target.files[0]"
        ImageFile = e.target.files[0];
        var blob = URL.createObjectURL(ImageFile);

        //change the DOM img element source to point to this file
        image.src = blob; //assign the "src" property of the "img" tag
    })
}
chooseFileListener();

function addMedInfo() {
    console.log("add your new medication");

    let Name = document.getElementById("nameAddInput").value;
    // let Code = document.getElementById("codeAddInput").value;
    let Intake = document.getElementById("intakeAddInput").value;
    let Details = document.getElementById("detailsAddInput").value;
    console.log(Name, Intake, Details);
    // Name, Code, Intake, Details

    firebase.auth().onAuthStateChanged(user => {
        if (user) 
            var userID = user.uid;
            //get the sub-collection of the document for current user.
            db.collection("users").doc(user.uid).collection("medications").add({
                name: Name,
                // code: Code,
                intake: Intake,
                details: Details,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }).then((doc) => {
                console.log(doc.id);
                updateMedImage(user.uid, doc.id);
                //window.location.href = "result.html"; //new line added
            })
        }) 
    };

function updateMedImage(userid, medid) {
    var storageRef = storage.ref("images/" + medid + ".jpg");
    console.log(storageRef);
    console.log(ImageFile);
    storageRef.put(ImageFile) //picture that was chosen
        .then(function () {
            console.log('Uploaded to Cloud Storage.');
            //Asynch call to get URL from Cloud
            storageRef.getDownloadURL()
                .then((url) => {   //"url" is the returned url pointing to cloud image
                    //Asynch call to image URL the form fields into Firestore.
                    db.collection("users").doc(userid)
                        .collection("medications").doc(medid).update({
                            picture: url // Save the URL into users collection
                        })
                        .then(function () {
                            console.log('Added Profile Pic URL to Firestore.');
                            console.log('Saved use profile info');
                            //document.getElementById('personalInfoFields').disabled = true;
                        }).then(()=>{
                            window.location.href = "../html/result.html"; //new line added
                        })
                })
        })
}