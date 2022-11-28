//---------------------------------------------------
// Loads the parts of skeleton 
// (navbar, footer, and other things) into html doc. 
//---------------------------------------------------
function loadSkeleton(){
    $('#navbarPlaceholder').load('../text/nav.html');
    $('#footerPlaceholder').load('../text/footer.html');
}
loadSkeleton();  //invoke the function

// checks if user is logged in
var currentUser;
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        currentUser = db.collection("users").doc(user.uid);   //global

        displayCards("users");
    } else {
        // No user is signed in.
        window.location.href = "../html/login.html";
    }
});

// function to display all added medicine as cards
function displayCards(collection) {
    let cardTemplate = document.getElementById("MedicationCardTemplate");
    firebase.auth().onAuthStateChanged(user => { 
        db.collection("users").doc(user.uid).collection("medications").get()
        .then(snap => {
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
            })
        })
    })
}
    
// carryover of data
function setMedData(id){
    localStorage.setItem ('MedID', id);
}