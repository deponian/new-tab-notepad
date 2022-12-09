(function() {

  function _makeDelayed() {
    var timer = 0;
    return function(callback, ms) {
      clearTimeout(timer);
      timer = setTimeout(callback, ms);
    };
  }

  function bindNoteHandlers() {
    var elem = document.getElementById('note-text'),
        saveHandler = _makeDelayed();
    function save() {
      chrome.storage.sync.set({'noteText': elem.value});
    }
    // Throttle save so that it only occurs after 50 millisecond without a keypress.
    elem.addEventListener('keydown', function() {
      saveHandler(save, 50);
    });
    elem.addEventListener('blur', save);
    chrome.storage.sync.get('noteText', function(data) {
      elem.value = data.noteText ? data.noteText : '';
    });
  }

  bindNoteHandlers();
})();
