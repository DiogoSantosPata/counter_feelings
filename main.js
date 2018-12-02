// Initialize Firebase
var config = {
  apiKey: "AIzaSyDIVOVTNjuITf9idH-ltup6jr344SN8XUA",
  authDomain: "countermood.firebaseapp.com",
  databaseURL: "https://countermood.firebaseio.com",
  projectId: "countermood",
  storageBucket: "countermood.appspot.com",
  messagingSenderId: "8355860655"
};
firebase.initializeApp(config);


var database = firebase.database();  // create global firebase database object
var textbox = document.getElementById('textbox');

textbox.onkeydown = function(e) {
  if (e.keyCode === 13 && textbox.value.length) {
      var userSentence = textbox.value;
      var rating = calcRating(userSentence)
      var counterRating = calcCounterRating(rating);
      addToDB(userSentence, rating);
      getCounterRatingSentence(counterRating, updateTextbox);
  }
}


function calcRating(sentence) {
  var sentimood = new Sentimood();
   return sentimood.analyze(sentence).score;      
}

function calcCounterRating(rating) {
  return - rating;
}

function updateTextbox(sentence) {
  textbox.value='';
  textbox.placeholder = sentence;
}


function getCounterRatingSentence(counterRating, cb){
  var ref = database.ref("sentences").orderByChild('score').equalTo(counterRating)
  ref.once('value').then(function(snapshot) {
    var counterSentences = _.toArray(snapshot.val());
    randomIndex = Math.floor( Math.random() * (counterSentences.length - 1) );
    cb(counterSentences[randomIndex].sentence);
    //cb is a callback function, meaning that is the function that will be executed asynchronously, 
    //as soon as we fetch the data from firebase
    //in this case we wanna update the DOM, so we pass "updateTextbox" as a callback 
  }); 
}


function addToDB(userSentence, rating){

  var sentences = database.ref('sentences');  // create database reference
  var data = {  // format data
    sentence: userSentence,
    score: rating
  }

  sentences.push(data);  // push data to the database

}

