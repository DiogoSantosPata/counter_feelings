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

var current_score;



function sentiment_analysis(ele) {

    if(event.key === 'Enter') {        
      var sentimood = new Sentimood();
      var analysis = sentimood.analyze(ele.value);
      console.log(analysis.score);
      current_score = analysis.score;
      // add_to_database(ele.value, current_score);
      get_counter_feeling_sentence(current_score);      
    }

}



// remove input for element (to be replaced with a static string)
function removeElement() { 
    // Removes an element from the document
    var element = document.getElementById("input_feelings");
    element.parentNode.removeChild(element);
}



function addElement(result_sentence) {
    var para = document.createElement("p");
    var node = document.createTextNode(result_sentence);
    para.appendChild(node);

    var element = document.getElementById("resulting_sentence");
    element.appendChild(para);
}



function get_counter_feeling_sentence(current_score){

  var ref = database.ref("sentences");
  ref.on("value", gotData, errData);
  
}





function errData(err) {
  console.log(err);
}



function gotData(data) {

  var closest_value_of_anti_feeling = 10000;
  var closest_index_of_anti_feeling;

  var sentences = data.val();
  // Grab the keys to iterate over the object
  var keys = Object.keys(sentences);



  // Find the stored sentences with closest negative feeling. e.g. if user inputs a 3 scored sentence, we want to get back a -3
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    // Look at each fruit object!
    var sentence = sentences[key];
    console.log(sentence);
    console.log( Math.abs( -1 * current_score - sentence.score ) );

    if( Math.abs( -1 * current_score - sentence.score ) <= closest_value_of_anti_feeling )
    {
      console.log(" ---- " + sentence.score )
      closest_value_of_anti_feeling = Math.abs( -1 * current_score - sentence.score );
      closest_index_of_anti_feeling = key;
    }

  }


  console.log(  sentences[ closest_index_of_anti_feeling].sentence );   // write this on the input form
  result_sentence = sentences[ closest_index_of_anti_feeling].sentence;


  removeElement();
  addElement(result_sentence);

}



function add_to_database(input_string, input_score){

  var sentences = database.ref('sentences');  // create database reference

  var data = {  // format data
    sentence: input_string,
    score: input_score
  }

  sentences.push(data);  // push data to the database

}




