
let voices;
let speaking_mode = false;
const recognition = new webkitSpeechRecognition();
let msg;
const speaker = window.speechSynthesis;

recognition.continuous = true;
recognition.interimResults = true;
recognition.language = 'en';
recognition.start();

// The voices load async, so we listen on this event to populate voices array:
window.speechSynthesis.onvoiceschanged = function() {
  voices = window.speechSynthesis.getVoices();
  voices = voices.filter(v => v.lang.includes('en'));
};


recognition.onresult = function(event) {
  var text = event.results[event.results.length - 1][0].transcript;
  console.log(text);

  if (text.trim().toLowerCase() == 'exit') {
    speaker.cancel();
  }

  if (!speaking_mode) {
    var msg_text = '';
    switch(text.trim()) {
      case 'read Prufrock': msg_text = prufrock; break;
      case 'read archaic torso': msg_text = torso; break;
      case 'read Ozymandias': msg_text = ozy; break;
    }

    if (msg_text) {
      speaking_mode = true;
      msg = new SpeechSynthesisUtterance(msg_text);
      msg.onend = () => console.log('ended!'); // Nice, this works.

      // CHOOSE VOICE:
      msg.voice = voices[4];

      speaker.speak(msg); // how do we determine if done speaking? See above!
    }
  }

};


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
