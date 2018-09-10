
var voices;

var recognition = new webkitSpeechRecognition();

recognition.continuous = true;
recognition.interimResults = true;
recognition.language = 'en';

var speaking = false;

recognition.start();

// The voices load async, so we listen on this event to populate voices array:
window.speechSynthesis.onvoiceschanged = function() {
  voices = window.speechSynthesis.getVoices();
  console.log(voices);
  voices = voices.filter(v => v.lang.includes('en'));
  console.log(voices);
};


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
      msg.voice = voices[4];

      window.speechSynthesis.speak(msg); // how do we determine if done speaking?
    }
    // console.log('reading');

  }

};
// };

// console.log('hi');

// recognition.onstart = function() {
//
// };


// recognition.onerror = function(event) { ... }
// recognition.onend = function() {
//   console.log(event.results[event.results.length - 1][0].transcript);
//
//   var msg = new SpeechSynthesisUtterance('Hello World');
//   window.speechSynthesis.speak(msg);
// };
