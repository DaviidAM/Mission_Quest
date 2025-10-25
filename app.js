const missions = [];

async function loadMissions() {
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

loadMissions();
