function bindNoteHandlers() {
  let elem = document.getElementById('note-text');
  function save() {
    chrome.storage.sync.set({'noteText': elem.value});
  }
  elem.addEventListener('keyup', save);
  elem.addEventListener('blur', save);
  chrome.storage.sync.get('noteText', function(data) {
    elem.value = data.noteText ? data.noteText : '';
  });
}

bindNoteHandlers();
