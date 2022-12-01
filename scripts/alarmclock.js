//Query selectors by its id or class name
const currentTime = document.querySelector("h1"),
    content = document.querySelector(".content"),
    selectMenu = document.querySelectorAll("select"),
    setAlarmBtn = document.querySelector("button");

populateAlarm();

// Check if user is logged in or not
var currentUser;
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        currentUser = db.collection("users").doc(user.uid);

    } else {

        console.log("No user is signed in");

    }
});

let alarmTime, isAlarmSet,
    ringtone = new Audio("../images/ringtone.mp3");

// Check user hour input
for (let i = 12; i > 0; i--) {
    i = i < 10 ? `0${i}` : i;
    let option = `<option value="${i}">${i}</option>`;
    selectMenu[0].firstElementChild.insertAdjacentHTML("afterend", option);
}

// Check user minute input
for (let i = 59; i >= 0; i--) {
    i = i < 10 ? `0${i}` : i;
    let option = `<option value="${i}">${i}</option>`;
    selectMenu[1].firstElementChild.insertAdjacentHTML("afterend", option);
}

// Check user am/pm input
for (let i = 2; i > 0; i--) {
    let ampm = i == 1 ? "AM" : "PM";
    let option = `<option value="${ampm}">${ampm}</option>`;
    selectMenu[2].firstElementChild.insertAdjacentHTML("afterend", option);
}

//Set interval of clock
setInterval(() => {
    let date = new Date(),
        h = date.getHours(),
        m = date.getMinutes(),
        s = date.getSeconds(),
        ampm = "AM";
    if (h >= 12) {
        h = h - 12;
        ampm = "PM";
    }
    h = h == 0 ? h = 12 : h;
    h = h < 10 ? "0" + h : h;
    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;
    currentTime.innerText = `${h}:${m}:${s} ${ampm}`;

    //Set alarm time
    if (alarmTime === `${h}:${m} ${ampm}`) {
        ringtone.play();
        ringtone.loop = true;
    }
});

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

//turn off alarm 
function turnOffAlarm() {
    isAlarmSet = true;
    if (isAlarmSet) {
        alarmTime = "";
        ringtone.pause();
        // Leave 'if' loop by setting condition = false
        return isAlarmSet = false;
    }

}

//Set alarm
function setAlarm() {

    // Grab user alarm set input and save it into var
    var time = `${selectMenu[0].value}:${selectMenu[1].value} ${selectMenu[2].value}`;
    alarmTime = time;

    var dayIndex = 0;

    //Check which day is selected. 
    for (let i = 0; i <= days.length; i++) {
        if (document.getElementById(`${days[i]}`).checked === true) {
            dayIndex = i;
            break;
        }
    }

    var userInputNote = document.getElementById("userNoteText").value;

    //Read user alarm setting and save it to firebase 
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            //Read user from users collection
            var currentUser = db.collection("users").doc(user.uid)
            var userID = user.uid;

            //Get user data with user id
            currentUser.get()
                .then(userDoc => {
                    var userEmail = userDoc.data().email;
                    //Add user alarm set data into firebase
                    db.collection("alarm").add({
                        userID: userID,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        email: userEmail,
                        hour: String([time[0] + time[1]]),
                        minute: String([time[3] + time[4]]),
                        AMPM: String(time[6] + time[7]),
                        day: dayIndex,
                        userNote: userInputNote
                    })
                        // Reload website after adding new alarm set
                        .then(() => {
                            populateAlarm()
                            window.location.reload()
                        })
                })
        }
    })

}

// Delete alarm set from alarm list 
function deleteAlarm(alarmId) {

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
           
            // Read user alarm set by alarm id and delete it
            db.collection("alarm").doc(alarmId).delete()
                //Reload after deleting alarm set
                .then(() => { window.location.reload() })
        }
    })
}

//Populate alarm set into alarm list
function populateAlarm() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {

            //Read alarm set by user id
            db.collection("alarm").where("userID", "==", user.uid)
                //Sort alarm list in ascending order of day, AM/PM, hour, and minute
                .orderBy("day")
                .orderBy("AMPM")
                .orderBy("hour")
                .orderBy("minute")

                //Get user aram set data from alarm collection by user id
                .get()

                .then(allReviews => {
                    reviews = allReviews.docs

                    document.getElementById("alarmlist").innerHTML = "";

                    //Save user alarm set in divs and append it to alarm list.
                    reviews.forEach(doc => {
                        //Declare user alarm datas
                        var userdays = doc.data().day
                        var userhours = doc.data().hour + ":" + doc.data().minute
                        var userAMPM = doc.data().AMPM
                        var alarmId = doc.id
                        var userNoteInput = doc.data().userNote;
                        var _button = document.createElement("button");
                        let userAlarmData = document.createElement("div");
                       
                        userAlarmData.classList.add("content", "alarmset");

                        //Create div element for alarm day 
                        let userDayDiv = document.createElement("div");
                        //Create div element for alarm hour 
                        let userHourDiv = document.createElement("div");
                        //Create span element for alarm note 
                        let userNoteSpan = document.createElement("span");
                       
                        userNoteSpan.classList.add("content", "userNote");
                        //Create div element for alarm AMPM
                        let userAMPMDiv = document.createElement("div");
                        //Create div element for delete button
                        let deleteDiv = document.createElement("div");

                        //Set user alarm data into HTML content
                        //User note input
                        userNoteSpan.innerHTML = userNoteInput;
                        //User day input
                        userDayDiv.innerHTML = days[userdays];
                        //User hour input
                        userHourDiv.innerHTML = userhours;
                        //User AMPM input
                        userAMPMDiv.innerHTML = userAMPM;
                        
                        deleteDiv.innerHTML = "";

                        //Attach user alarm data to userAlarmData div
                        userAlarmData.appendChild(userNoteSpan);
                        userAlarmData.appendChild(userHourDiv);
                        userAlarmData.appendChild(userDayDiv);
                        userAlarmData.appendChild(userAMPMDiv);
                        userAlarmData.appendChild(deleteDiv);

                        deleteDiv.appendChild(_button);

                        _button.innerHTML = "Delete"
                        //Set attribute to call deleteAlarm function when delete button is clicked
                        _button.setAttribute("onclick", `deleteAlarm('${alarmId}')`);
                        deleteDiv.classList.add("delete");

                        //Attach alarm set data to alarm list div
                        document.getElementById("alarmlist").appendChild(userAlarmData);

                    })
                })

        }
    })
}




