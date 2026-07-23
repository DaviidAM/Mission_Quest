const missions = [];

// ─── Default Guide Missions ─────────────────────────────────────────────────
// These missions serve as a step-by-step guide for users to create their own
// Mission Quest. They are shown by default when no missions/index.json exists.

const GUIDE_DESCRIPTION = [
  "Create your own Mission Quest — it's easier than you think:",
  "1. ⚙️ Open the configurator",
  "2. ✏️ Edit the title and missions",
  "3. 🔗 Press 'Generate URL' to share"
];

const GUIDE_MISSIONS = [
  {
    title: "⚙️ Open the configurator",
    desc: "Press the gear button (⚙️) in the top right corner to open the mission configurator panel."
  },
  {
    title: "✏️ Edit the title and missions",
    desc: "In the configurator, change the intro text and add or edit the missions for your own quest."
  },
  {
    title: "🔗 Press 'Generate URL' to share",
    desc: "Press 'Generate URL' to create a shareable link containing all your missions. Share it with anyone!"
  }
];

// Global error handler to catch silent failures (e.g. CDN load errors)
window.onerror = function(msg, src, line, col, err) {
  console.error("[Global Error]", msg, "at", src, "line", line, "col", col);
  if (err && err.stack) console.error(err.stack);
  return false;
};

let mainDescription = "";

function setIntro(lines) {
  const container = document.getElementById("introContainer");
  if (!container) return;
  container.innerHTML = "";
  lines.forEach(line => {
    const p = document.createElement("p");
    p.className = "intro";
    p.textContent = line;
    container.appendChild(p);
  });
}

async function loadMissions() {
  // Check for ?data= parameter first
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get("data");
  if (encoded) {
    try {
      const { intro, missions: decodedMissions } = decodeMissions(encoded);
      missions.length = 0;
      missions.push(...decodedMissions);
      if (intro && intro.length > 0) {
        mainDescription = intro.join("\n");
        setIntro(intro);
      }
      level = 0;
      levelSpan.textContent = level;
      renderMissions();
      return;
    } catch (e) {
      // Fall through to normal loading on decode error
    }
  }

  // 1. Load mission files
  let files = [];
  try {
    const res = await fetch('missions/index.json');
    files = await res.json();
  } catch (e) {
    // No missions/index.json — use the guide missions as default
    mainDescription = GUIDE_DESCRIPTION.join("\n");
    setIntro(GUIDE_DESCRIPTION);
    missions.length = 0;
    missions.push(...GUIDE_MISSIONS.map(m => ({ ...m })));
    level = 0;
    levelSpan.textContent = level;
    renderMissions();
    return;
  }
  let jsons = [];
  try {
    jsons = await Promise.all(
      files.map(file => fetch('missions/list/' + file).then(r => r.json()))
    );
  } catch (e) {
    missionsDiv.innerHTML = '<p style="color:red">Failed to load mission details.</p>';
    return;
  }
  // 2. Read progress from localStorage
  let completed = [];
  let remoteLevel = 0;
  // Read progress from localStorage (static web mode)
  completed = JSON.parse(localStorage.getItem('missions_completed') || '[]');
  remoteLevel = parseInt(localStorage.getItem('missions_level') || '0', 10);
  level = remoteLevel;
  missions.length = 0;
  missions.push(...jsons);
  // Mark completed missions
  completed.forEach(idx => {
    if (missions[idx]) missions[idx].completed = true;
  });
  levelSpan.textContent = level;
  renderMissions();
}

function saveCompletedMissions() {
  const completed = missions.map((m, i) => m.completed ? i : null).filter(i => i !== null);
  localStorage.setItem('missions_completed', JSON.stringify(completed));
  localStorage.setItem('missions_level', level);
  // Sync with backend globally
  // Currently only syncs with localStorage
}


let level = parseInt(localStorage.getItem('missions_level') || '0', 10);

const missionsDiv = document.getElementById("missions");
const levelSpan = document.getElementById("level");
levelSpan.textContent = level;
const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popupTitle");
const popupDesc = document.getElementById("popupDesc");
const completeBtn = document.getElementById("completeBtn");
const reactivateBtn = document.getElementById("reactivateBtn");
const closePopup = document.getElementById("closePopup");

let currentMissionIdx = null;

function renderMissions() {
  missionsDiv.innerHTML = "";
  missions.forEach((mission, idx) => {
    const btn = document.createElement("button");
    btn.className = "mission" + (mission.completed ? " completed" : "");
    btn.textContent = mission.title;
    btn.onclick = () => openPopup(idx);

    // Ya no deshabilitamos el botón para permitir abrir misiones completas
    missionsDiv.appendChild(btn);
  });
}

function openPopup(idx) {
  currentMissionIdx = idx;
  popupTitle.textContent = missions[idx].title;
  popupDesc.textContent = missions[idx].desc;
  if (missions[idx].completed) {
    completeBtn.style.display = "none";
    reactivateBtn.style.display = "inline-block";
  } else {
    completeBtn.style.display = "inline-block";
    reactivateBtn.style.display = "none";
  }
  popup.classList.remove("hidden");
}

function closePopupFunc() {
  popup.classList.add("hidden");
}

completeBtn.onclick = function() {
  if (currentMissionIdx !== null && !missions[currentMissionIdx].completed) {
    missions[currentMissionIdx].completed = true;
    level += 1;
    levelSpan.textContent = level;
    saveCompletedMissions();
    renderMissions();
    completeBtn.style.display = "none";
    reactivateBtn.style.display = "inline-block";
    closePopupFunc();
  }
};

reactivateBtn.onclick = function() {
  if (currentMissionIdx !== null && missions[currentMissionIdx].completed) {
    missions[currentMissionIdx].completed = false;
    level = Math.max(0, level - 1);
    levelSpan.textContent = level;
    saveCompletedMissions();
    renderMissions();
    reactivateBtn.style.display = "none";
    completeBtn.style.display = "inline-block";
    closePopupFunc();
  }
};

closePopup.onclick = closePopupFunc;
popup.onclick = function(e) {
  if (e.target === popup) closePopupFunc();
};

document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") closePopupFunc();
});

// ─── Mission Configurator ───────────────────────────────────────────────

const configMissions = [];

const configModal = document.getElementById("configModal");
const configBtn = document.getElementById("configBtn");
const configClose = document.getElementById("configClose");
const configIntro = document.getElementById("configIntro");
configIntro.oninput = function() { setIntro(configIntro.value.split("\n")); };
const configTitle = document.getElementById("configTitle");
const configDesc = document.getElementById("configDesc");
const addMissionBtn = document.getElementById("addMissionBtn");
const configMissionList = document.getElementById("configMissionList");
const exportBtn = document.getElementById("exportBtn");
const demoBtn = document.getElementById("demoBtn");

let editingIndex = null;

const demoMissions = [
  { title: "Go to the gym", desc: "Do 30 minutes of cardio" },
  { title: "Walk the dog", desc: "Take a 30-minute walk" },
  { title: "Read", desc: "Read 20 pages" }
];

function encodeMissions(missions, intro) {
  // JSON: {intro: [...lines], missions: [{title,desc},...]}
  const payload = JSON.stringify({ intro: intro.split("\n"), missions });
  return LZString.compressToEncodedURIComponent(payload);
}

function decodeMissions(encoded) {
  const decompressed = LZString.decompressFromEncodedURIComponent(encoded);
  const obj = JSON.parse(decompressed);
  return { intro: obj.intro || [], missions: obj.missions || [] };
}

function renderConfigMissions() {
  configMissionList.innerHTML = "";
  configMissions.forEach((m, idx) => {
    const item = document.createElement("div");
    item.className = "config-mission-item";

    const titleSpan = document.createElement("span");
    titleSpan.className = "item-title";
    titleSpan.textContent = m.title;

    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.textContent = "Edit";
    editBtn.onclick = () => {
      configTitle.value = m.title;
      configDesc.value = m.desc;
      editingIndex = idx;
      addMissionBtn.textContent = "Save changes";
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => {
      configMissions.splice(idx, 1);
      renderConfigMissions();
  syncMissions();
      syncMissions();
    };

    item.appendChild(titleSpan);
    item.appendChild(editBtn);
    item.appendChild(deleteBtn);
    configMissionList.appendChild(item);
  });
}

// Sync configMissions → main missions array and re-render
function syncMissions() {
  missions.length = 0;
  configMissions.forEach(m => missions.push({ title: m.title, desc: m.desc }));
  renderMissions();
}

function openConfigModal() {
  configIntro.value = mainDescription;
  configModal.classList.remove("hidden");
}

function openConfigModalForEdit(idx) {
  const m = missions[idx];
  configTitle.value = m.title;
  configDesc.value = m.desc;
  editingIndex = idx;
  addMissionBtn.textContent = "Save changes";
  openConfigModal();
}

function closeConfigModal() {
  mainDescription = configIntro.value;
  configModal.classList.add("hidden");
  configTitle.value = "";
  configDesc.value = "";
  editingIndex = null;
  addMissionBtn.textContent = "Add mission";
}

configBtn.onclick = openConfigModal;
configClose.onclick = closeConfigModal;
configModal.onclick = function(e) {
  if (e.target === configModal) closeConfigModal();
};

addMissionBtn.onclick = function() {
  const title = configTitle.value.trim();
  const desc = configDesc.value.trim();
  if (!title) return;
  if (editingIndex !== null) {
    configMissions[editingIndex] = { title, desc };
    editingIndex = null;
    addMissionBtn.textContent = "Add mission";
  } else {
    configMissions.push({ title, desc });
  }
  configTitle.value = "";
  configDesc.value = "";
  renderConfigMissions();
  syncMissions();
  syncMissions();
};

exportBtn.onclick = function() {
  const encoded = encodeMissions(configMissions, configIntro.value);
  const fullUrl = window.location.origin + window.location.pathname + '?data=' + encoded;
  const exportedUrlEl = document.getElementById('exportedUrl');
  const urlButtons = document.getElementById('exportUrlButtons');
  exportedUrlEl.value = fullUrl;
  exportedUrlEl.style.display = 'block';
  urlButtons.style.display = 'flex';
};

document.getElementById('copyUrlBtn').onclick = function() {
  const url = document.getElementById('exportedUrl').value;
  navigator.clipboard.writeText(url).then(() => alert('URL copied!'));
};

document.getElementById('openUrlBtn').onclick = function() {
  const url = document.getElementById('exportedUrl').value;
  window.open(url, '_blank');
};

demoBtn.onclick = function() {
  configMissions.length = 0;
  configMissions.push(...demoMissions.map(m => ({ title: m.title, desc: m.desc })));
  renderConfigMissions();
  configIntro.value = "Greetings, brave adventurer.\nYou are about to embark on a series of secret missions, designed to test your skills and determination.\nEach challenge completed will unlock hidden rewards and increase your level in this enigmatic journey into the unknown. Are you ready to accept the challenge?";
  setIntro(configIntro.value.split("\n"));
  syncMissions();
};

document.addEventListener("keydown", function(e) {
  if (e.key === "Escape" && !configModal.classList.contains("hidden")) {
    closeConfigModal();
  }
});

loadMissions();
