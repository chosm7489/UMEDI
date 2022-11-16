var currentMedication = localStorage.getItem("MedID");

function populateInfo() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {

            //go to the correct history document by referencing to the history id
            currentMedication = db.collection("history").doc(history.id)
            //get the document for current medication.
            currentMedication.get()
                .then(historyDoc => {
                    //get the data fields of the medication
                    var medName = historyDoc.data().name;
                    var medCode = historyDoc.data().code;
                    var medIntake = historyDoc.data().Intake_Frequency;
                    var medDetails = historyDoc.data().details;

                    //if the data fields are not empty, then write them in to the form.
                    if (nameInput != null) {
                        document.getElementById("nameInput").value = medName;
                    }
                    if (codeInput != null) {
                        document.getElementById("codeInput").value = medCode;
                    }
                    if (intakeInput != null) {
                        document.getElementById("intakeFreq").value = medIntake;
                    }
                    if (detailsInput != null) {
                        document.getElementById("details").value = medDetails;
                    }
                })
        } else {
            // No user is signed in.
            console.log ("No user is signed in");
        }
    });
}

//call the function to run it 
populateInfo();

function editMedInfo() {
    // Enable the form fields
    document.getElementById('medicationInfoFields').disabled = false;
}

function saveMedInfo() {
    medName = document.getElementById('nameInput').value;         //get the value of the field with id="nameInput"
    medCode = document.getElementById('codeInput').value;         //get the value of the field with id="codeInput"
    medIntake = document.getElementById('intakeInput').value;     //get the value of the field with id="intakeInput"
    medDetails = document.getElementById('detailsInput').value;   //get the value of the field with id="detailsInput"

    currentMedication.update({
        name: medName,
        code: medCode,
        Intake_Frequency: medIntake,
        details: medDetails
    })
    .then(() => {
        console.log("Document successfully updated!");
    })

    document.getElementById('medicationInfoFields').disabled = true;
}