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

for (let i = 12; i > 0; i--) {
    i = i < 10 ? `0${i}` : i;
    let option = `<option value="${i}">${i}</option>`;
    selectMenu[0].firstElementChild.insertAdjacentHTML("afterend", option);
}

for (let i = 59; i >= 0; i--) {
    i = i < 10 ? `0${i}` : i;
    let option = `<option value="${i}">${i}</option>`;
    selectMenu[1].firstElementChild.insertAdjacentHTML("afterend", option);
}

for (let i = 2; i > 0; i--) {
    let ampm = i == 1 ? "AM" : "PM";
    let option = `<option value="${ampm}">${ampm}</option>`;
    selectMenu[2].firstElementChild.insertAdjacentHTML("afterend", option);
}

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
        return isAlarmSet = false;
    }

}


function setAlarm() {

    //Set 
    var time = `${selectMenu[0].value}:${selectMenu[1].value} ${selectMenu[2].value}`;
    alarmTime = time;
   
    var dayIndex = 0;

    for (let i = 0; i <= days.length; i++) {
        if (document.getElementById(`${days[i]}`).checked === true) {
            dayIndex = i;
            break;
        }
    }

    var userInputNote = document.getElementById("userNoteText").value;

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var currentUser = db.collection("users").doc(user.uid)
            var userID = user.uid;
            currentUser.get()
                .then(userDoc => {
                    var userEmail = userDoc.data().email;
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
                        .then(() => {
                            console.log("work!");
                            populateAlarm()
                            
                        })

                })


        }
    })

}
// Delete alarm set from alarm list
function deleteAlarm(alarmId) {

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            db.collection("alarm").doc(alarmId).delete()
                .then(() => { window.location.reload() })
        }
    })
}

//Populate alarm set into alarm list
function populateAlarm() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
          
            db.collection("alarm").where("userID", "==" ,user.uid )
                .orderBy("day")
                .orderBy("AMPM")
                .orderBy("hour")
                .orderBy("minute")

                .get()
               
                .then(allReviews => {
                    reviews = allReviews.docs

                    document.getElementById("alarmlist").innerHTML = "";

                    reviews.forEach(doc => {
                        var userdays = doc.data().day
                        var userhours = doc.data().hour + ":" + doc.data().minute
                    
                        var userAMPM = doc.data().AMPM
                        var alarmId = doc.id
                        var _button = document.createElement("button");
                        var usernoteinput = doc.data().userNote;

                        let userdata = document.createElement("div");
                        userdata.classList.add("content", "alarmset");
                        let d1 = document.createElement("div");
                        let d2 = document.createElement("div");
                        let d3 = document.createElement("span");
                        d3.classList.add("content", "userNote");

                        let d4 = document.createElement("div");
                        let d5 = document.createElement("div");

                        d3.innerHTML = usernoteinput;
                        d1.innerHTML = days[userdays];
                        d2.innerHTML = userhours;
                        d4.innerHTML = userAMPM;
                        d5.innerHTML = "";

                        userdata.appendChild(d3);
                        userdata.appendChild(d1);
                        userdata.appendChild(d2);
                        userdata.appendChild(d4);
                        userdata.appendChild(d5);

                        d5.appendChild(_button);
                        _button.innerHTML = "Delete"
                        _button.setAttribute("onclick", `deleteAlarm('${alarmId}')`);
                        d5.classList.add("delete");

                        document.getElementById("alarmlist").appendChild(userdata);

                    })
                })

        }
    })
}

setAlarmBtn.addEventListener("click", setAlarm);


