

// console.log('hi');
var recognition = new webkitSpeechRecognition();
// console.log(recognition);
recognition.continuous = true;
recognition.interimResults = true;
recognition.language = 'en';

var speaking = false;

recognition.start();
// recognition.onstart = function() {
//
// };

recognition.onresult = function(event) {
  var text = event.results[event.results.length - 1][0].transcript;
  // console.log(event.results[event.results.length - 1][0].transcript);
  console.log(text);

  if (!speaking) {
    var msg_text = '';
    switch(text.trim()) {
      case 'read Prufrock': msg_text = prufrock; break;
      case 'read archaic torso': msg_text = torso; break;
      case 'read Ozymandias': msg_text = ozy; break;
    }

    if (msg_text) {
      speaking = true;
      var msg = new SpeechSynthesisUtterance(msg_text);
      window.speechSynthesis.speak(msg); // how do we determine if done speaking?
    }
    // console.log('reading');

  }

};
// recognition.onerror = function(event) { ... }
// recognition.onend = function() {
//   console.log(event.results[event.results.length - 1][0].transcript);
//
//   var msg = new SpeechSynthesisUtterance('Hello World');
//   window.speechSynthesis.speak(msg);
// };
