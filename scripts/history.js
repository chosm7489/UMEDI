//---------------------------------------------------
// Loads the parts of skeleton 
// (navbar, footer, and other things) into html doc. 
//---------------------------------------------------
function loadSkeleton(){
    $('#navbarPlaceholder').load('../text/nav.html');
    $('#footerPlaceholder').load('../text/footer.html');
}
loadSkeleton();  //invoke the function

var currentUser;
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        currentUser = db.collection("users").doc(user.uid);   //global

        // the following functions are always called when someone is logged in
        displayCards("users");
    } else {
        // No user is signed in.
        window.location.href = "../html/login.html";
    }
});

function displayCards(collection) {
    let cardTemplate = document.getElementById("MedicationCardTemplate");
    firebase.auth().onAuthStateChanged(user => { 
        db.collection("users").doc(user.uid).collection("medications").get()
        .then(snap => {
            //var i = 1;  //if you want to use commented out section
            snap.forEach(doc => { //iterate thru each doc
                var title = doc.data().name;        // get value of the "name" key
                var details = doc.data().details;   // get value of the "details" key
                var Intake = doc.data().intake; // get value of the "intake" key
				var MedID = doc.data().code;    //get unique ID to each hike to be used for fetching right image
                var URL = doc.data().picture;
                let newcard = cardTemplate.content.cloneNode(true);

                //update title and text and image
                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('.card-text').innerHTML = details;
                newcard.querySelector('.card-image').src = URL;
                newcard.querySelector('.card-intake').innerHTML = Intake;
                newcard.querySelector('a').onclick = () => setMedData(MedID);

                //attach to gallery
                document.getElementById("history-go-here").appendChild(newcard);
                //i++;   //if you want to use commented out section
            })
        })
    })
}

function setMedData(id){
    localStorage.setItem ('MedID', id);
}