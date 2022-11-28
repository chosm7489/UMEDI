## My Web Application (Add your Title here)

* [General info](#general-info)
* [Technologies](#technologies)
* [Contents](#content)

## General Info
This browser based web application to ...
* Hi my name is Sukhraj. I'm excited about this project because I feel like we are working on a real world problem that can be solved.
* Hi my name is Eric. I am excited to join this team!	
* Hi, my name is Helen and I am excited for this project because I can practice coding and make something useful!

## Technologies
Technologies used for this project:
* HTML, CSS
* JavaScript
* Bootstrap 
* Firebase
	
## Content
Content of the project folder:

```
 Top level of project folder: 
├── .gitignore               # Git ignore file
├── index.html               # landing HTML file, this is what users see when you come to url
├── template.html            # Template file for creating other html files
└── README.md
└── Template.html            # template for all html pages after user signin

It has the following subfolders and files:
├── .git                     # Folder for git repo
├── html                     # Folder for all html that are displaying content.
    /about                   # HTML for the about page of the devs.
    /addmedication           # HTML adding new medications for the user.
    /alarmclock              # HTML for displaying an alarm, setting alarms, and deleting alarms.
    /FAQ                     # HTML for commonly asked questions
    /history                 # HTML for displaying the current medication the user
    /login                   # HTML for when the user is signing up or logging in
    /main                    # HTML for when the user is logging in
    /medication              # HTML editing the current medications that the user has editing
    /result                  # HTML for using when the user has added a new medication.
├── images                   # Folder for images, referenced from https://fonts.google.com/icons
    /alarm.png               # Icon for alarm
    /clock.svg               # Functioning alarm clock displaying current local time
    /medicine.png            # Icon for medicine
    /ringtone.mp3            # Ringtone for alarm
├── scripts                  # Folder for scripts
    /addmedication.js        # JS that grabs the current input from the user, and will store that into a database as well as link
    /alarmclock.js           # JS that makes uses various function to get and delete collections
    /authentication.js       # JS that uses firebase authentication for users to log in
    /history.js              # JS to get document information and show user
    /main.js                 # JS to read daily quote, see who is currently logged in and log-out user
    /medication.js           # JS get and save new information of the user
    /skeleton.js             # JS used to grab nav and footer html
├── styles                   # Folder for styles
    /Aboutstyle.css          # CSS to center text
    /Alarmstyle.css          # CSS for alarm page
    /FAQstyle.css            # CSS center text on FAQ
    /HistoryStyle.css        # CSS for history
    /main.css                # CSS to center text and added icons
    /Resultstyle.css         # CSS to center results
└──

Firebase hosting files: 
├── .firebaserc...

Documentation:
├── https://cloud.google.com/firestore/docs
├── https://devdocs.io/javascript/
├── https://getbootstrap.com/docs/4.1/getting-started/introduction/


```

Tips for file naming files and folders:
* use lowercase with no spaces
* use dashes (not underscore) for word separation

