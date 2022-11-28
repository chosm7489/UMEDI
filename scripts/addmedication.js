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

// function for adding medication info and storing information into firestore
function addMedInfo() {
    let Name = document.getElementById("nameAddInput").value;
    let Code = document.getElementById("codeAddInput").value;
    let Intake = document.getElementById("intakeAddInput").value;
    let Details = document.getElementById("detailsAddInput").value;

    firebase.auth().onAuthStateChanged(user => {
        if (user) 

            //get the sub-collection of the document for current user.
            db.collection("users").doc(user.uid).collection("medications").add({
                name: Name,
                code: Code,
                intake: Intake,
                details: Details,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }).then((doc) => {
                updateMedImage(user.uid, doc.id);
            })
    }) 
};

// function to update image to cloud
function updateMedImage(userid, medid) {
    var storageRef = storage.ref("images/" + medid + ".jpg");
    storageRef.put(ImageFile) //picture that was chosen
        .then(function () {
            //Asynch call to get URL from Cloud
            storageRef.getDownloadURL()
                .then((url) => {   //"url" is the returned url pointing to cloud image
                    //Asynch call to image URL the form fields into Firestore.
                    db.collection("users").doc(userid)
                        .collection("medications").doc(medid).update({
                            picture: url // Save the URL into users collection
                        })
                        }).then(()=>{
                            window.location.href = "result.html";
                        })
                })
        // })
}