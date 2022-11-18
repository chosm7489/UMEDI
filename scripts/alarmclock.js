const currentTime = document.querySelector("h1"),
    content = document.querySelector(".content"),
    selectMenu = document.querySelectorAll("select"),
    setAlarmBtn = document.querySelector("button");

populateAlarm();

var currentUser;
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        currentUser = db.collection("users").doc(user.uid);   //global
        console.log(currentUser);

      
    } else {
        // No user is signed in.
        console.log("No user is signed in");
        // window.location.href = "login.html";
    }
});

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
                    })
                        .then(() => {

                            populateAlarm()
                            // readAlarm();
                            // window.location.href = "thanks.html";
                        })

                })


        }
    })

}

function populateAlarm() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // var currentUser = db.collection("alarm").doc(user.uid)

            db.collection("alarm").where("userID", "==", user.uid)
                // .orderBy("timestamp")            //NEW LINE;  what do you want to sort by?
                // .limitToLast(5)                       //NEW LINE:  how many do you want to get?
                .get()
                // .then(allHikes => {
                // allHikes.forEach(somedoc => {

                .then(allReviews => {
                    reviews = allReviews.docs
                    console.log(reviews);

                    document.getElementById("alarmlist").innerHTML = "";

                    reviews.forEach(doc => {
                        var userdays = doc.data().day
                        var userhours = doc.data().hour
                        var userminute = doc.data().minute
                        var userAMPM = doc.data().AMPM
                        // document.getElementById("dayss").innerHTML = userdays;
           
                        let userdata = document.createElement("div");
                        userdata.classList.add("content");
                        let d1 = document.createElement("div");
                        let d2 = document.createElement("div");
                        let d3= document.createElement("div");
                        let d4 = document.createElement("div");

                        d1.innerHTML = userdays;
                        d2.innerHTML = userhours;
                        d3.innerHTML = userminute;
                        d4.innerHTML = userAMPM
                        
                        userdata.appendChild(d1);
                        userdata.appendChild(d2);
                        userdata.appendChild(d3);
                        userdata.appendChild(d4);
                        
                        document.getElementById("alarmlist").appendChild(userdata);
                        
                        

                    })
                })

            // console.log(JSON.stringify(userday));
            document.getElementById("dayss").innerHTML = somedoc.data().day;
            document.getElementById("hourss").innerHTML = somedoc.data().hour;
            document.getElementById("minutess").innerHTML = somedoc.data().minute;
            document.getElementById("AMPM").innerHTML = somedoc.data().AMPM;

          
        }
    })
}
setAlarmBtn.addEventListener("click", setAlarm);

// function setuserData(id) {
//     localStorage.setItem('userID', id);
// }
