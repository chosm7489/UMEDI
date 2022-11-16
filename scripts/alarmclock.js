const currentTime = document.querySelector("h1"),
    content = document.querySelector(".content"),
    selectMenu = document.querySelectorAll("select"),
    setAlarmBtn = document.querySelector("button");

let alarmTime, isAlarmSet,
    ringtone = new Audio("./images/ringtone.mp3");

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

function setAlarm() {
    if (isAlarmSet) {
        alarmTime = "";
        ringtone.pause();
        content.classList.remove("disable");
        setAlarmBtn.innerText = "Set Alarm";
        return isAlarmSet = false;
    }

    var time = `${selectMenu[0].value}:${selectMenu[1].value} ${selectMenu[2].value}`;
    alarmTime = time;
    isAlarmSet = true;
    content.classList.add("disable");
    setAlarmBtn.innerText = "Clear Alarm";

    var timeSetUp = db.collection("alarm");

    const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

    for (let i = 0; i <= days.length; i++) {
        if (document.getElementById(`${days[i]}`).checked === true) {
            var userDay = days[i];
            break;
        }
    }
    // timeSetUp.add({
    //     hour: String([time[0] + time[1]]),
    //     minute: String([time[3] + time[4]]),
    //     AMPM: String(time[6] + time[7]),
    //     day: userDay,
    // }
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
                        day: userDay,
                        // }).then(()=>{
                        //     window.location.href = "thanks.html";
                    })
                })
            // var currentAlarm = db.collection("alarm").doc(user.uid)    
            // currentAlarm.get()
            //     .then(                              //name of the collection and documents should matach excatly with what you have in Firestore
            //         somedoc => {                                                               //arrow notation
            //             console.log("current document data: " + somedoc.data().AMPM);                          //.data() returns data object
            //             // document.getElementById("hour").innerHTML = somedoc.data().hour;
            //             // document.getElementById("hour").innerHTML = somedoc.data().hour;
            //             // document.getElementById("minute").innerHTML = somedoc.data().minute;
            //             // document.getElementById("AMPM").innerHTML = somedoc.data().AMPM;         //using javascript to display the data on the right place
            //             //using json object indexing
            //         })
        }
    })

    // function readAlarm() {
    //     var currentAlarm = db.collection("alarm").doc(user.uid)                                                      //name of the collection and documents should matach excatly with what you have in Firestore
    //         currentAlarm.get()
    //         .then(somedoc => {                                                               //arrow notation
    //             //  console.log("current document data: " + somedoc.data());                          //.data() returns data object
    //             document.getElementById("days").innerHTML = somedoc.data().day;
    //             document.getElementById("hour").innerHTML = somedoc.data().hour;
    //             document.getElementById("minute").innerHTML = somedoc.data().minute;
    //             document.getElementById("AMPM").innerHTML = somedoc.data().AMPM;         //using javascript to display the data on the right place
    //             //using json object indexing
    //         })
    // }

    // readAlarm();
}

setAlarmBtn.addEventListener("click", setAlarm);

