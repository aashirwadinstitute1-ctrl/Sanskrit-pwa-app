/* app.js
   Core logic: loads database JSON, search, and renders dictionary / declensions / conjugations / translator.
   Expects `sanskrit_database_full.json` in same folder (large JSON auto-generated).
*/

const DB_FILE = 'sanskrit_database_full.json'; // keep this file in repo root
let DB = null;

const queryEl = document.getElementById('query');
const searchBtn = document.getElementById('searchBtn');
const resultsEl = document.getElementById('results');
const toolSelect = document.getElementById('toolSelect');
const clearBtn = document.getElementById('clearBtn');

const panelDict = document.getElementById('panelDict');
const panelDecl = document.getElementById('panelDecl');
const panelConj = document.getElementById('panelConj');
const panelTrans = document.getElementById('panelTrans');

const dictContent = document.getElementById('dictContent');
const declContent = document.getElementById('declContent');
const conjContent = document.getElementById('conjContent');
const transContent = document.getElementById('transContent');

function showPanel(name){
  panelDict.style.display = panelDecl.style.display = panelConj.style.display = panelTrans.style.display = 'none';
  if(name==='dict') panelDict.style.display = 'block';
  if(name==='decl') panelDecl.style.display = 'block';
  if(name==='conj') panelConj.style.display = 'block';
  if(name==='translate') panelTrans.style.display = 'block';
}

toolSelect.addEventListener('change', ()=> showPanel(toolSelect.value));
clearBtn.addEventListener('click', ()=>{ queryEl.value=''; resultsEl.innerHTML=''; dictContent.innerHTML=''; declContent.innerHTML=''; conjContent.innerHTML=''; transContent.innerHTML=''; });

searchBtn.addEventListener('click', ()=> doSearch(queryEl.value.trim()));

queryEl.addEventListener('keydown', (e)=> { if(e.key==='Enter') doSearch(queryEl.value.trim()); });

async function loadDB(){
  resultsEl.innerHTML = 'Loading database…';
  try{
    const r = await fetch(DB_FILE);
    DB = await r.json();
    resultsEl.innerHTML = 'Database loaded. Use search box above.';
  }catch(err){
    resultsEl.innerHTML = 'Failed to load database. Make sure ' + DB_FILE + ' exists in repo root.';
    console.error(err);
  }
}
function doSearch(q){
  resultsEl.innerHTML = '';
  if(!q) { resultsEl.innerHTML = '<div style="color:#e11d48">कृपया शब्द टाइप करें।</div>'; return; }
  if(!DB){ resultsEl.innerHTML = '<div style="color:#e11d48">Database not loaded yet.</div>'; return; }

  // exact key match (Sanskrit) first
  if(DB.dictionary && DB.dictionary[q]){
    renderDictionary(q, DB.dictionary[q]);
    return;
  }
  // if user typed english or hindi, try to find in meanings
  const hits = [];
  for(const key of Object.keys(DB.dictionary)){
    const entry = DB.dictionary[key];
    const en = (entry.meaning && entry.meaning.en) ? entry.meaning.en.toLowerCase() : '';
    const hi = (entry.meaning && entry.meaning.hi) ? entry.meaning.hi.toLowerCase() : '';
    if(en.includes(q.toLowerCase()) || hi.includes(q.toLowerCase()) || key.includes(q)) hits.push(key);
    if(hits.length>50) break;
  }
  if(hits.length===0){
    resultsEl.innerHTML = `<div style="color:#f59e0b">कोई परिणाम नहीं मिला: "${q}"</div>`;
    return;
  }
  resultsEl.innerHTML = `<div><b>प्रतिक्रियाएँ (${hits.length}) —</b></div>` + hits.slice(0,50).map(k=>`<div class="hit" style="padding:6px 0;border-bottom:1px dashed #eef6ff;cursor:pointer" data-key="${k}">${k} — ${(DB.dictionary[k].meaning||{}).en||''} ${(DB.dictionary[k].meaning||{}).hi? ' / '+DB.dictionary[k].meaning.hi: ''}</div>`).join('');
  // attach click
  document.querySelectorAll('.hit').forEach(el=>{
    el.addEventListener('click', ()=> {
      const k = el.getAttribute('data-key');
      renderDictionary(k, DB.dictionary[k]);
    });
  });
}

function renderDictionary(key, entry){
  showPanel('dict');
  let html = `<h3>${key}</h3>`;
  html += `<div><b>POS:</b> ${entry.pos||''} ${entry.gender? (' • लिङ्: '+entry.gender): ''}</div>`;
  if(entry.meaning) html += `<div><b>अर्थ:</b> ${(entry.meaning.hi||'')} — <span style="font-family:monospace">${entry.meaning.en||''}</span></div>`;
  // if declensions available
  if(DB.shabdaRupa && DB.shabdaRupa[key]){
    html += `<div style="margin-top:8px"><button onclick="renderDecl('${key}')">शब्दरूप दिखायें</button></div>`;
  }
  if(DB.dhatuRupa && DB.dhatuRupa[key]){
    html += `<div style="margin-top:8px"><button onclick="renderConj('${key}')">धातुरूप दिखायें</button></div>`;
  }
  html += `<div style="margin-top:12px"><button onclick="speakText('${key}')">🔊 श्रोतु</button></div>`;
  dictContent.innerHTML = html;
}

function renderDecl(key){
  showPanel('decl');
  const rec = DB.shabdaRupa[key];
  if(!rec){ declContent.innerHTML = 'कोई शब्दरूप उपलब्ध नहीं।'; return; }
  const vibs = ['prathama','dvitiya','tritiya','caturthi','panchami','shashthi','saptami','sambodhana'];
  const names = ['प्रथमा','द्वितीया','तृतीया','चतुर्थी','पञ्चमी','षष्ठी','सप्तमी','सम्बोधन'];
  let html = `<h3>${key} — (${rec.gender||''})</h3><table><thead><tr><th>विभक्ति</th><th>एकवचन</th><th>द्विवचन</th><th>बहुवचन</th></tr></thead><tbody>`;
  for(let i=0;i<vibs.length;i++){
    const v = vibs[i];
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
