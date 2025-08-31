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
  }
}

// ---------------- Dictionary ----------------
function showDict(q) {
  const data = db.dictionary[q];
  document.getElementById("panelDict").style.display = "block";

  if (!data) {
    document.getElementById("dictContent").innerHTML = "❌ शब्द नहीं मिला";
    return;
  }
  document.getElementById("dictContent").innerHTML = `<h3>${q}</h3><p>${data}</p>`;
}

// ---------------- ShabdaRupa (Declensions) ----------------
function showDecl(q) {
  const data = db.shabdaRupa[q];
  document.getElementById("panelDecl").style.display = "block";

  if (!data) {
    document.getElementById("declContent").innerHTML = "❌ शब्दरूप नहीं मिला";
    return;
  }

  let html = `<h3>${q} (${data.gender === "m" ? "पुंलिङ्ग" : data.gender === "f" ? "स्त्रीलिङ्ग" : "नपुंसकलिङ्ग"})</h3>`;
  html += "<table class='declTable'><tr><th>वचन</th><th>विभक्ति</th><th>रूप</th></tr>";

  const vacanas = ["singular", "dual", "plural"];
  const vibhaktis = ["prathama","dvitiya","tritiya","chaturthi","panchami","shashthi","saptami","sambodhana"];

  vacanas.forEach(v => {
    vibhaktis.forEach(vib => {
      html += `<tr><td>${v}</td><td>${vib}</td><td>${data.forms[v][vib]}</td></tr>`;
    });
  });

  html += "</table>";
  document.getElementById("declContent").innerHTML = html;
}

// ---------------- DhatuRupa (Conjugations) ----------------
function showConj(q) {
  const data = db.dhatuRupa[q];
  document.getElementById("panelConj").style.display = "block";

  if (!data) {
    document.getElementById("conjContent").innerHTML = "❌ धातु नहीं मिला";
    return;
  }

  let html = `<h3>${q} (${data.meaning})</h3>`;

  // सभी लकार दिखाना
  for (let lakar in data.lakar) {
    html += `<h4>${lakar.toUpperCase()} लकार</h4>`;
    html += "<table class='conjTable'><tr><th>वचन</th><th>पुरुष</th><th>रूप</th></tr>";

    const vacanas = ["singular","dual","plural"];
    const purushOrder = ["prathama","madhyama","uttama"]; // ✅ सही क्रम

    vacanas.forEach(v => {
      purushOrder.forEach(purush => {
        if (data.lakar[lakar][v][purush]) {
          html += `<tr><td>${v}</td><td>${purush}</td><td>${data.lakar[lakar][v][purush]}</td></tr>`;
        }
      });
    });

    html += "</table>";
  }

  document.getElementById("conjContent").innerHTML = html;
}    document.getElementById("transContent").innerHTML = "❌ अनुवाद नहीं मिला";
    return;
  }

  document.getElementById("transContent").innerHTML =
    `<h3>${q}</h3><p>${data}</p>`;
}
