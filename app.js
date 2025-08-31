let db = {};
let currentTool = "dict";

// JSON database लोड करना
fetch("sanskrit_database_full.json")
  .then(r => r.json())
  .then(j => {
    db = j;
    console.log("DB loaded", db);
  });

// UI Controls
document.getElementById("toolSelect").addEventListener("change", e => {
  currentTool = e.target.value;
});

document.getElementById("clearBtn").addEventListener("click", () => {
  document.getElementById("query").value = "";
  document.getElementById("results").innerHTML = "";
  hideAllPanels();
});

document.getElementById("searchBtn").addEventListener("click", () => {
  let q = document.getElementById("query").value.trim();
  if (!q) return;
  searchQuery(q);
});

// सभी panels hide करने का function
function hideAllPanels() {
  document.querySelectorAll(".panel").forEach(p => (p.style.display = "none"));
}

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
