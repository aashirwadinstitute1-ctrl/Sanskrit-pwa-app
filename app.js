let db = {};
let currentTool = "dict";

// JSON database लोड करना
fetch("sanskrit_database_full.json")
  .then(r => r.json())
  .then(j => {
    db = j;
    console.log("DB loaded", db);
  });

// Tool select
document.getElementById("toolSelect").addEventListener("change", e => {
  currentTool = e.target.value;
});

// Clear button
document.getElementById("clearBtn").addEventListener("click", () => {
  document.getElementById("query").value = "";
  document.getElementById("results").innerHTML = "";
  hideAllPanels();
});

// Search button
document.getElementById("searchBtn").addEventListener("click", () => {
  let q = document.getElementById("query").value.trim();
  if (!q) return;
  searchQuery(q);
});

// सभी panels hide करने का function
function hideAllPanels() {
  document.querySelectorAll(".panel").forEach(p => (p.style.display = "none"));
}

// Search logic
function searchQuery(q) {
  hideAllPanels();

  if (currentTool === "dict") {
    showDict(q);
  } else if (currentTool === "decl") {
    showDecl(q);
  } else if (currentTool === "conj") {
    showConj(q);
  } else if (currentTool === "translate") {
    showTranslate(q);
  }
}

function showDict(q) {
  let res = db.dictionary?.[q];
  document.getElementById("panelDict").style.display = "block";
  document.getElementById("dictContent").innerText = res || "❌ शब्द नहीं मिला";
}

function showDecl(q) {
  let res = db.declensions?.[q];
  document.getElementById("panelDecl").style.display = "block";
  document.getElementById("declContent").innerText = res || "❌ शब्दरूप नहीं मिला";
}

function showConj(q) {
  let res = db.conjugations?.[q];
  document.getElementById("panelConj").style.display = "block";
  document.getElementById("conjContent").innerText = res || "❌ धातुरूप नहीं मिला";
}

function showTranslate(q) {
  let res = db.translations?.[q];
  document.getElementById("panelTrans").style.display = "block";
  document.getElementById("transContent").innerText = res || "❌ अनुवाद नहीं मिला";
}
