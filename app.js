// Utility: Show only one panel at a time
function showPanel(id) {
  document.querySelectorAll(".panel").forEach(p => p.style.display = "none");
  if (id) document.getElementById(id).style.display = "block";
}

async function searchWord() {
  const q = document.getElementById("query").value.trim();
  const tool = document.getElementById("toolSelect").value;
  const resBox = document.getElementById("results");

  if (!q) {
    resBox.innerHTML = "<p>कृपया कोई शब्द लिखें।</p>";
    return;
  }

  resBox.innerHTML = "⏳ खोज रहा है...";

  let url = "";
  if (tool === "dict") { url = "data/dictionary.json"; }
  if (tool === "decl") { url = "data/shabdarupa.json"; }
  if (tool === "conj") { url = "data/dhaturupa.json"; }

  try {
    if (tool === "translate") {
      // Stub translation (later can connect API)
      showPanel("panelTrans");
      document.getElementById("transContent").innerHTML = `<p><b>${q}</b> → (अनुवाद coming soon)</p>`;
      resBox.innerHTML = "";
      return;
    }

    const r = await fetch(url);
    const data = await r.json();

    if (data[q]) {
      const out = `<h3>${q}</h3><pre>${data[q].join("\n")}</pre>
        <button onclick="speakText('${q}')">🔊 उच्चारण</button>`;
      resBox.innerHTML = out;

      if (tool === "dict") { showPanel("panelDict"); document.getElementById("dictContent").innerHTML = out; }
      if (tool === "decl") { showPanel("panelDecl"); document.getElementById("declContent").innerHTML = out; }
      if (tool === "conj") { showPanel("panelConj"); document.getElementById("conjContent").innerHTML = out; }
    } else {
      resBox.innerHTML = "❌ परिणाम नहीं मिला।";
      showPanel();
    }
  } catch (err) {
    resBox.innerHTML = "⚠ डेटा लोड करने में समस्या हुई।";
    showPanel();
  }
}

function clearSearch() {
  document.getElementById("query").value = "";
  document.getElementById("results").innerHTML = "";
  showPanel();
}

function speakText(txt) {
  if (!window.speechSynthesis) return;
  const msg = new SpeechSynthesisUtterance(txt);
  msg.lang = "sa-IN"; // Sanskrit/Indic voice (browser dependent)
  window.speechSynthesis.speak(msg);
}

// Event Listeners
document.getElementById("searchBtn").addEventListener("click", searchWord);
document.getElementById("clearBtn").addEventListener("click", clearSearch);
document.getElementById("query").addEventListener("keypress", e => {
  if (e.key === "Enter") searchWord();
});
