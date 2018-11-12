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

      if(ele.value.length > 0) {

        var sentimood = new Sentimood();
        var analysis = sentimood.analyze(ele.value);      
        current_score = analysis.score;
        add_to_database(ele.value, current_score);
        get_counter_feeling_sentence(current_score);      
    }

  }

}




function addElement(result_sentence) {  
    document.getElementById("input_feelings").value="";
    document.getElementById("input_feelings").placeholder=result_sentence;
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
  var keys = Object.keys(sentences); // Grab the keys to iterate over the object



  var a = [];
  for(i=0; i<keys.length;i++){ a.push(i); }
  a = shuffle(a);



  // Find the stored sentences with closest negative feeling. e.g. if user inputs a 3 scored sentence, we want to get back a -3
  for (var i = 0; i < keys.length; i++) {
    var key = keys[ a[i] ];    
    var sentence = sentences[key];
    
    if( Math.abs( -1 * current_score - sentence.score ) <= closest_value_of_anti_feeling )
    {
      closest_value_of_anti_feeling = Math.abs( -1 * current_score - sentence.score );
      closest_index_of_anti_feeling = key;
    }

  }

  result_sentence = sentences[ closest_index_of_anti_feeling].sentence;
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





function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}