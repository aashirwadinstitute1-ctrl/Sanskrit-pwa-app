async function searchWord() {
  const q = document.getElementById("query").value.trim();
  const tool = document.getElementById("toolSelect").value;
  const res = document.getElementById("results");

  if (!q) { res.innerText = "कृपया कोई शब्द लिखें।"; return; }

  res.innerText = "🔄 खोजा जा रहा है...";

  if (tool === "translate") {
    showPanel("panelTrans");
    document.getElementById("transContent").innerText = `${q} → (अनुवाद जल्द आएगा)`;
    res.innerText = "";
    return;
  }

  const urlMap = {
    dict: "data/dictionary.json",
    decl: "data/shabdarupa.json",
    conj: "data/dhaturupa.json"
  };

  try {
    const response = await fetch(urlMap[tool]);
    const data = await response.json();

    if (!data[q]) {
      res.innerText = "❌ परिणाम नहीं मिला।";
      showPanel();
      return;
    }

    const output = data[q].join("\n");
    res.innerHTML = `<pre>${output}</pre>\n<button onclick="tts('${q}')">🔊 उच्चारण</button>`;

    const panelId = { dict: "panelDict", decl: "panelDecl", conj: "panelConj" }[tool];
    showPanel(panelId);
    document.getElementById(panelId.replace("panel", "").toLowerCase() + "Content").innerHTML = res.innerHTML;

  } catch (e) {
    res.innerText = "⚠ डेटा लोड में त्रुटि!";
    showPanel();
  }
}

function clearSearch() {
  document.getElementById("query").value = "";
  document.getElementById("results").innerText = "";
  showPanel();
}

function showPanel(id) {
  document.querySelectorAll(".panel").forEach(p => p.style.display = "none");
  if (id) document.getElementById(id).style.display = "block";
}

function tts(text) {
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = 'sa-IN';
  speechSynthesis.speak(msg);
}

document.getElementById("searchBtn").onclick = searchWord;
document.getElementById("clearBtn").onclick = clearSearch;
document.getElementById("query").addEventListener('keypress', e => {
  if (e.key === 'Enter') searchWord();
});
