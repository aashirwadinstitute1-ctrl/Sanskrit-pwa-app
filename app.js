// ==============================
// Sanskrit PWA — app.js
// ==============================

// Database cache
let db = null;

// Load JSON database
async function loadDatabase() {
  if (db) return db;
  const response = await fetch("sanskrit_database_full.json");
  db = await response.json();
  return db;
}

// Utility: clear results + panels
function clearAll() {
  document.getElementById("results").innerHTML = "";
  document.querySelectorAll(".panel").forEach(p => p.style.display = "none");
}

// Search handler
async function doSearch() {
  const query = document.getElementById("query").value.trim();
  const tool = document.getElementById("toolSelect").value;
  const data = await loadDatabase();
  clearAll();

  if (!query) return;

  // dictionary
  if (tool === "dict") {
    showDict(query, data);
  }
  // declensions
  else if (tool === "decl") {
    showDecl(query, data);
  }
  // conjugations
  else if (tool === "conj") {
    showConj(query, data);
  }
  // translate (dummy for now)
  else if (tool === "translate") {
    showTranslate(query);
  }
}

// ============ Dictionary ============
function showDict(query, data) {
  const panel = document.getElementById("panelDict");
  const dictDiv = document.getElementById("dictContent");
  panel.style.display = "block";

  const entry = data.dict[query];
  if (!entry) {
    dictDiv.innerHTML = "<p>शब्द नहीं मिला।</p>";
    return;
  }

  let html = `<h3>${query}</h3><ul>`;
  entry.forEach(mean => {
    html += `<li>${mean}</li>`;
  });
  html += "</ul>";
  dictDiv.innerHTML = html;
}

// ============ Declensions ============
function showDecl(query, data) {
  const panel = document.getElementById("panelDecl");
  const declDiv = document.getElementById("declContent");
  panel.style.display = "block";

  const entry = data.decl[query];
  if (!entry) {
    declDiv.innerHTML = "<p>शब्दरूप उपलब्ध नहीं।</p>";
    return;
  }

  let html = "<table><tr><th>विभक्ति</th><th>एकवचन</th><th>द्विवचन</th><th>बहुवचन</th></tr>";
  Object.keys(entry).forEach(caseName => {
    const forms = entry[caseName];
    html += `<tr>
      <td>${caseName}</td>
      <td>${forms[0]}</td>
      <td>${forms[1]}</td>
      <td>${forms[2]}</td>
    </tr>`;
  });
  html += "</table>";
  declDiv.innerHTML = html;
}

// ============ Conjugations ============
function showConj(query, data) {
  const panel = document.getElementById("panelConj");
  const conjDiv = document.getElementById("conjContent");
  panel.style.display = "block";

  const entry = data.conj[query];
  if (!entry) {
    conjDiv.innerHTML = "<p>धातुरूप उपलब्ध नहीं।</p>";
    return;
  }

  // ✅ सही क्रम
  const persons = ["प्रथमपुरुष", "मध्यमपुरुष", "उत्तमपुरुष"];

  let html = "<table><tr><th>पुरुष</th><th>एकवचन</th><th>द्विवचन</th><th>बहुवचन</th></tr>";
  persons.forEach(person => {
    const forms = entry[person] || ["–","–","–"];
    html += `<tr>
      <td>${person}</td>
      <td>${forms[0]}</td>
      <td>${forms[1]}</td>
      <td>${forms[2]}</td>
    </tr>`;
  });
  html += "</table>";
  conjDiv.innerHTML = html;
}

// ============ Translate ============
function showTranslate(query) {
  const panel = document.getElementById("panelTrans");
  const transDiv = document.getElementById("transContent");
  panel.style.display = "block";

  // अभी के लिए dummy
  transDiv.innerHTML = `<p>"${query}" का अनुवाद सुविधा जल्द ही जोड़ा जाएगा।</p>`;
}

// ============ Event Listeners ============
document.getElementById("searchBtn").addEventListener("click", doSearch);
document.getElementById("clearBtn").addEventListener("click", () => {
  document.getElementById("query").value = "";
  clearAll();
});    const v = vibs[i];
    html += `<tr><th>${names[i]}</th><td>${rec.forms.singular[v]||''}</td><td>${rec.forms.dual[v]||''}</td><td>${rec.forms.plural[v]||''}</td></tr>`;
  }
  html += '</tbody></table>';
  declContent.innerHTML = html;
}

function renderConj(key){
  showPanel('conj');
  const rec = DB.dhatuRupa[key];
  if(!rec){ conjContent.innerHTML = 'कोई धातुरूप उपलब्ध नहीं।'; return; }
  let html = `<h3>${key} — ${(rec.meaning||'')}</h3>`;
  // IMPORTANT: person order must be uttama (1st), madhyama (2nd), prathama (3rd)
  const personKeys = ['uttama','madhyama','prathama'];
  const personLabels = {'uttama':'उत्तमः','madhyama':'मध्यमः','prathama':'प्रथमः'};
  for(const lakar of Object.keys(rec.lakar || {})){
    const forms = rec.lakar[lakar];
    html += `<h4>${lakar}</h4><table><thead><tr><th>पुरुष</th><th>एकवचन</th><th>द्विवचन</th><th>बहुवचन</th></tr></thead><tbody>`;
    for(const pk of personKeys){
      html += `<tr><th>${personLabels[pk]||pk}</th><td>${(forms.singular && forms.singular[pk])||''}</td><td>${(forms.dual && forms.dual[pk])||''}</td><td>${(forms.plural && forms.plural[pk])||''}</td></tr>`;
    }
    html += `</tbody></table>`;
  }
  conjContent.innerHTML = html;
}

function translateText(txt){
  if(!DB) return 'DB not loaded';
  const parts = txt.trim().split(/\s+/);
  const out = parts.map(p=>{
    if(DB.dictionary[p] && DB.dictionary[p].meaning) return `${p} → ${DB.dictionary[p].meaning.hi||''} / ${DB.dictionary[p].meaning.en||''}`;
    return `${p} → (no entry)`;
  });
  return out.join('<br>');
}
function speakText(text){
  if(!('speechSynthesis' in window)) return alert('Speech not supported');
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'sa-IN';
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

loadDB();}

function renderConj(key){
  showPanel('conj');
  const rec = DB.dhatuRupa[key];
  if(!rec){ conjContent.innerHTML = 'कोई धातुरूप उपलब्ध नहीं।'; return; }
  let html = `<h3>${key} — ${(rec.meaning||'')}</h3>`;
  for(const lakar of Object.keys(rec.lakar || {})){
    html += `<h4>${lakar}</h4><table><thead><tr><th>पुरुष</th><th>एकवचन</th><th>द्विवचन</th><th>बहुवचन</th></tr></thead><tbody>`;
    ['uttama','madhyama','prathama'].forEach(person=>{
      html += `<tr><th>${person}</th><td>${(rec.lakar[lakar].singular && rec.lakar[lakar].singular[person])||''}</td><td>${(rec.lakar[lakar].dual && rec.lakar[lakar].dual[person])||''}</td><td>${(rec.lakar[lakar].plural && rec.lakar[lakar].plural[person])||''}</td></tr>`;
    });
    html += `</tbody></table>`;
  }
  conjContent.innerHTML = html;
}

function translateText(txt){
  // simple translator: map known dictionary words; for phrases split and map.
  if(!DB) return 'DB not loaded';
  const parts = txt.trim().split(/\s+/);
  const out = parts.map(p=>{
    if(DB.dictionary[p]) return `${p} → ${(DB.dictionary[p].meaning.hi||'')} / ${(DB.dictionary[p].meaning.en||'')}`;
    return `${p} → (no entry)`;
  });
  return out.join('<br>');
}
function speakText(text){
  if(!('speechSynthesis' in window)) return alert('Speech not supported');
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'sa-IN';
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

// Translator UI binding
document.getElementById('toolSelect').addEventListener('change', ()=>{
  showPanel(document.getElementById('toolSelect').value);
});
document.getElementById('searchBtn').addEventListener('click', ()=>{
  const t = document.getElementById('query').value.trim();
  if(document.getElementById('toolSelect').value==='translate'){
    transContent.innerHTML = translateText(t);
    showPanel('translate');
  } else {
    doSearch(t);
  }
});

// initial load
loadDB();
