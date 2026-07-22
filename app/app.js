const missions = [];

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
    missionsDiv.innerHTML = '<p style="color:red">Failed to load mission list.</p>';
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

    const gear = document.createElement("span");
    gear.className = "mission-gear";
    gear.textContent = "\u2699";
    gear.onclick = (e) => {
      e.stopPropagation();
      openConfigModalForEdit(idx);
    };

    btn.appendChild(gear);
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
const configTitle = document.getElementById("configTitle");
const configDesc = document.getElementById("configDesc");
const addMissionBtn = document.getElementById("addMissionBtn");
const configMissionList = document.getElementById("configMissionList");
const exportBtn = document.getElementById("exportBtn");
const demoBtn = document.getElementById("demoBtn");

let editingIndex = null;

const demoMissions = [
  { title: "Ir al gym", desc: "Hacer cardio 30min" },
  { title: "Sacar al perro", desc: "Pasear 30 min" },
  { title: "Leer", desc: "Leer 20 páginas" }
];

function encodeMissions(missions, intro) {
  // JSON: {intro: [...lines], missions: [{title,desc},...]}
  const payload = JSON.stringify({ intro: intro.split("\n"), missions });
  const compressed = pako.deflate(payload);
  return btoa(String.fromCharCode.apply(null, compressed))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodeMissions(encoded) {
  // base64url → base64
  const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const decompressed = pako.inflate(bytes, { to: 'string' });
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
    editBtn.textContent = "Editar";
    editBtn.onclick = () => {
      configTitle.value = m.title;
      configDesc.value = m.desc;
      editingIndex = idx;
      addMissionBtn.textContent = "Guardar cambios";
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Eliminar";
    deleteBtn.onclick = () => {
      configMissions.splice(idx, 1);
      renderConfigMissions();
    };

    item.appendChild(titleSpan);
    item.appendChild(editBtn);
    item.appendChild(deleteBtn);
    configMissionList.appendChild(item);
  });
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
  addMissionBtn.textContent = "Guardar cambios";
  openConfigModal();
}

function closeConfigModal() {
  mainDescription = configIntro.value;
  configModal.classList.add("hidden");
  configTitle.value = "";
  configDesc.value = "";
  editingIndex = null;
  addMissionBtn.textContent = "Añadir misión";
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
    addMissionBtn.textContent = "Añadir misión";
  } else {
    configMissions.push({ title, desc });
  }
  configTitle.value = "";
  configDesc.value = "";
  renderConfigMissions();
};

exportBtn.onclick = function() {
  const encoded = encodeMissions(configMissions, configIntro.value);
  const url = new URL(window.location.href);
  url.search = "?data=" + encoded;
  window.location.href = url.toString();
};

demoBtn.onclick = function() {
  configMissions.length = 0;
  configMissions.push(...demoMissions.map(m => ({ title: m.title, desc: m.desc })));
  renderConfigMissions();
};

document.addEventListener("keydown", function(e) {
  if (e.key === "Escape" && !configModal.classList.contains("hidden")) {
    closeConfigModal();
  }
});

loadMissions();
