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
  }
}

// ---------------- Dictionary ----------------
function showDict(q) {
  const data = db.dict[q];
  document.getElementById("panelDict").style.display = "block";

  if (!data) {
    document.getElementById("dictContent").innerHTML = "❌ शब्द नहीं मिला";
    return;
  }

  document.getElementById("dictContent").innerHTML =
    `<h3>${q}</h3><p>${data}</p>`;
}

// ---------------- Declensions ----------------
function showDecl(q) {
  const data = db.decl[q];
  document.getElementById("panelDecl").style.display = "block";

  if (!data) {
    document.getElementById("declContent").innerHTML = "❌ शब्दरूप नहीं मिला";
    return;
  }

  let html = "<table class='declTable'><tr><th>विभक्ति</th><th>रूप</th></tr>";
  Object.keys(data).forEach(vibhakti => {
    html += `<tr><td>${vibhakti}</td><td>${data[vibhakti].join(", ")}</td></tr>`;
  });
  html += "</table>";

  document.getElementById("declContent").innerHTML = html;
}

// ---------------- Conjugations ----------------
function showConj(q) {
  const data = db.conj[q];
  document.getElementById("panelConj").style.display = "block";

  if (!data) {
    document.getElementById("conjContent").innerHTML = "❌ धातु नहीं मिला";
    return;
  }

  // Order fix → प्रथमा → मध्यम → उत्तम
  const order = ["प्रथमा", "मध्यम", "उत्तम"];
  let html = "<table class='conjTable'><tr><th>पुरुष</th><th>रूप</th></tr>";

  order.forEach(purush => {
    if (data[purush]) {
      data[purush].forEach((rup, i) => {
        html += `<tr><td>${purush} (${i + 1})</td><td>${rup}</td></tr>`;
      });
    }
  });

  html += "</table>";
  document.getElementById("conjContent").innerHTML = html;
}

// ---------------- Translator ----------------
function showTranslate(q) {
  const data = db.trans[q];
  document.getElementById("panelTrans").style.display = "block";

  if (!data) {
    document.getElementById("transContent").innerHTML = "❌ अनुवाद नहीं मिला";
    return;
  }

  document.getElementById("transContent").innerHTML =
    `<h3>${q}</h3><p>${data}</p>`;
}
