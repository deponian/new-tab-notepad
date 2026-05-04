const API = "https://translate.deponian.com";

function bindNoteHandlers() {
  let noteText = document.getElementById('note-text');
  let note = document.getElementById('note');
  function save() {
    chrome.storage.sync.set({'noteText': noteText.value});
  }
  noteText.addEventListener('keyup', save);
  noteText.addEventListener('blur', save);
  chrome.storage.sync.get('noteText', function(data) {
    noteText.value = data.noteText ? data.noteText : '';
  });

  document.addEventListener("keypress", async (e) => {
    if (e.ctrlKey && e.code === "KeyL") {
      e.preventDefault();
      const login = prompt('Login');
      const password = prompt('Password');
      note.style.border = "orange 5px solid";

      const body = JSON.stringify({
          login: login,
          password: password,
        })

      const res = await fetch(API + "/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: body
      })
      if (res.ok) {
        document.cookie = "token=Bearer " + (await res.json()).token;
        note.style.border = "none";
      } else note.style.border = "red 5px solid"
    }

    if (e.ctrlKey && e.code === "KeyE") {
      e.preventDefault();
      note.style.border = "orange 5px solid";

      const body = JSON.stringify({
        text: noteText.value,
        lang: "EN"
      })

      const res = await fetch(API + "/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": getCookie("token")
        },
        body: body
      })
      if (res.ok) {
        noteText.value = (await res.json()).translations[0].text;
        note.style.border = "none";
      } else note.style.border = "red 5px solid";
    }

    if (e.ctrlKey && e.code === "KeyR") {
      e.preventDefault();
      note.style.border = "orange 5px solid";

      const body = JSON.stringify({
        text: noteText.value,
        lang: "RU"
      })

      const res = await fetch(API + "/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": getCookie("token")
        },
        body: body
      })
      if (res.ok) {
        noteText.value = (await res.json()).translations[0].text;
        note.style.border = "none";
      } else note.style.border = "red 5px solid";
    }
  })
}

function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

bindNoteHandlers();
