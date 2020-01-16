const firebase = require("firebase");

var firebaseConfig = {
    apiKey: "AIzaSyAa73_xXcZLWUfqtRzVrIYrNarRvVGsGVk",
    authDomain: "eleven-518d8.firebaseapp.com",
    databaseURL: "https://eleven-518d8.firebaseio.com",
    projectId: "eleven-518d8",
    storageBucket: "eleven-518d8.appspot.com",
    messagingSenderId: "802940870743",
    appId: "1:802940870743:web:2fb418e561cae383e54312",
    measurementId: "G-DHBBGH50XN"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const database = firebase.database();

module.exports = database;