// --------- UX: mobile hint + menu ----------
setTimeout(function () {
  if (window.innerWidth < 768) {
    alert("💡 This site is best viewed on a desktop for the best experience!");
  }
}, 1000);

function toggleMenu() {
  const nav = document.querySelector(".nav-menu");
  if (nav) nav.classList.toggle("show");
}

document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobileNav");
  if (hamburger && mobileNav) {
    hamburger.addEventListener("click", () => {
      mobileNav.classList.toggle("active");
    });
  }
});

// ============================
// Buddy Info (now with voices)
// ============================
const buddyInfo = {
  Ray: {
    title: "Ray",
    description: "Your smart and friendly guide for all physics labs. Always ready with fun facts and helpful hints!",
    img: "assets/buddies/ray.png",
    voicePrefs: ["Google US English", "Microsoft Guy Online (Natural) - English (United States)", "Daniel", "Alex"],
    voiceRate: 1.0,
    voicePitch: 1.0,
    introVoiceText: "Hi, I'm Ray, your physics lab buddy. Let's learn something cool today!"
  },
  ChemPal: {
    title: "ChemPal",
    description: "A cheerful chemistry sidekick who loves colorful reactions and safe lab habits.",
    img: "assets/buddies/chempal.png",
    voicePrefs: ["Google UK English Female", "Microsoft Aria Online (Natural) - English (United States)", "Samantha"],
    voiceRate: 1.0,
    voicePitch: 1.05,
    introVoiceText: "Hey there! I'm ChemPal. Ready to mix, measure, and master chemistry together?"
  },
  Vivi: {
    title: "Vivi",
    description: "Your bright and bubbly virtual lab buddy who lights up every experiment with enthusiasm and curiosity. Expert at making science fun and easy to understand.",
    img: "C2P1.png",
    favoriteQuote: "Learning is the spark that makes the world shine!",
    funFact: "Loves dancing to upbeat tunes while helping students explore science.",
    mission: "To inspire excitement and confidence in every student through interactive and joyful virtual labs.",
    // We still pick a voice, but we'll add a *robotic child* delivery in code (staccato + higher pitch)
voicePrefs: [
  "Daniel" // Apple’s UK English male voice, often faster and lighter
],
    voiceRate: 1.5,
    voicePitch: 2.0, // higher for child-like
    introVoiceText: "Hi! I am Vivi. I make science fun, friendly, and easy to follow!"
  },
  Nova: {
    title: "Dr. Nova Spark",
    description: "A quantum tech specialist who electrifies your virtual labs with brilliance and curiosity. Expert in quantum mechanics, advanced simulations, and futuristic technologies.",
    img: "C1P1.png",
    favoriteQuote: "Science is the spark that ignites imagination.",
    funFact: "Loves stargazing and often finds inspiration from the cosmos.",
    mission: "To make complex science accessible, interactive, and fun for every student.",
    voicePrefs: ["Google US English", "Microsoft Aria Online (Natural) - English (United States)", "Samantha", "Alex"],
    voiceRate: 0.98,
    voicePitch: 1.05,
    introVoiceText: "Hello, I’m Dr. Nova Spark, your quantum tech specialist. Let’s light up your experiments together."
  },
  RoboRay: {
    title: "RoboRay",
    description: "A futuristic AI robot buddy who combines high-tech precision with a friendly personality. Expert in robotics, automation, and problem-solving.",
    img: "assets/buddies/roboray.png",
    favoriteQuote: "Precision meets personality.",
    funFact: "Can calculate faster than light... well, almost!",
    mission: "To assist students in exploring technology with accuracy, curiosity, and fun.",
    voicePrefs: ["Google US English", "Microsoft Christopher Online (Natural) - English (United States)", "Daniel", "Alex"],
    voiceRate: 0.95,
    voicePitch: 0.9,
    introVoiceText: "Greetings. I am RoboRay. Calibrated and ready to assist with your experiments."
  }
};

// ============================
// Utility: safe filename
// ============================
function safeBuddyFilename(name) {
  return name.toLowerCase().replace(/\s+/g, '');
}

// ============================
// VOICE: Setup (Web Speech API - FREE)
// ============================
let __voices = [];
let __voicesReady = false;

function loadVoicesOnce() {
  if (!('speechSynthesis' in window)) return;
  __voices = window.speechSynthesis.getVoices() || [];
  __voicesReady = __voices.length > 0;
}
loadVoicesOnce();
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    loadVoicesOnce();
  };
}

// pick best available voice by preferred names; fallback by language
function chooseVoice(preferences = []) {
  if (!__voicesReady || !__voices.length) return null;

  const lcPrefs = preferences.map(p => String(p).toLowerCase());
  let v = __voices.find(v => lcPrefs.includes(v.name.toLowerCase()));
  if (v) return v;

  // fallback: English voices
  v = __voices.find(v => /^en(-|_|$)/i.test(v.lang));
  if (v) return v;

  return __voices[0] || null;
}

function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// --- Robotic child-like delivery for Vivi ---
// Splits text into small chunks and queues them with higher pitch/rate.
// This gives a subtle “robotic” staccato feel using only the Web Speech API.
function speakViviRobot(text, baseVoice, rate = 1.12, pitch = 1.55) {
  if (!('speechSynthesis' in window)) return;
  stopSpeaking();

  const words = String(text).split(/\s+/);
  const chunks = [];
  let current = [];
  words.forEach((w, i) => {
    current.push(w);
    if (current.join(' ').length > 12 || /[.!?,]$/.test(w) || i === words.length - 1) {
      chunks.push(current.join(' '));
      current = [];
    }
  });

  chunks.forEach((chunk, idx) => {
    const u = new SpeechSynthesisUtterance(chunk);
    if (baseVoice) u.voice = baseVoice;
    // child-like + robot-ish
    u.rate = rate + (idx % 2 ? 0.03 : -0.02);
    u.pitch = pitch + (idx % 3 ? -0.05 : 0.07);
    u.volume = 1.0;
    // Add a tiny pause rhythmically by inserting a zero-length utterance with a space
    if (idx > 0) {
      const pause = new SpeechSynthesisUtterance(" ");
      pause.rate = 0.8;
      pause.pitch = 1.0;
      pause.volume = 0.0; // silent pause
      window.speechSynthesis.speak(pause);
    }
    window.speechSynthesis.speak(u);
  });
}

// Speak helper for a buddy
function speakForBuddy(buddyName, textOverride = null) {
  if (!('speechSynthesis' in window)) return;

  const info = buddyInfo[buddyName] || buddyInfo.Ray;
  const text = textOverride || info.introVoiceText || `Hello, I am ${info.title}`;

  const speakNow = () => {
    const chosen = chooseVoice(info.voicePrefs || []);
    if (buddyName === "Vivi") {
      // special robotic child-like pattern
      speakViviRobot(text, chosen, info.voiceRate || 1.12, info.voicePitch || 1.55);
      return;
    }

    const utter = new SpeechSynthesisUtterance(text);
    if (chosen) utter.voice = chosen;
    utter.rate = info.voiceRate || 1.0;
    utter.pitch = info.voicePitch || 1.0;
    utter.volume = 1.0;

    stopSpeaking(); // cancel prior speech
    window.speechSynthesis.speak(utter);
  };

  if (__voicesReady) speakNow();
  else {
    setTimeout(() => {
      loadVoicesOnce();
      speakNow();
    }, 250);
  }
}

// ============================
// DOM Ready: interactions
// ============================
document.addEventListener('DOMContentLoaded', () => {
  // Card click -> show details (ignore clicks on select button)
  document.querySelectorAll('.buddy-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.select-btn')) return;
      const buddyName = card.dataset.buddy;
      if (!buddyName) return;
      showBuddyDetails(buddyName);
    });
  });

  // Attach handlers to explicit "Choose" buttons (new / restored)
  // Works whether the button has data-buddy itself or lives inside .buddy-card
  document.querySelectorAll('.select-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const btnBuddy = btn.dataset.buddy
        || (btn.closest('.buddy-card') && btn.closest('.buddy-card').dataset.buddy);
      if (!btnBuddy) return;
      selectBuddy(btnBuddy);
    });
  });

  // Modal close handlers
  const modal = document.getElementById('buddyDetailModal');
  const closeBtn = document.getElementById('buddyDetailClose');
  if (closeBtn) closeBtn.addEventListener('click', () => { stopSpeaking(); closeBuddyModal(); });
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) { stopSpeaking(); closeBuddyModal(); }
    });
  }

  // Auth: show picker, load buddy
  firebase.auth().onAuthStateChanged(user => {
    const authBtn = document.getElementById("authBtn");
    const buddyPicker = document.getElementById("buddyPicker");

    if (user) {
      if (authBtn) {
        authBtn.innerText = "Logout";
        authBtn.onclick = () => {
          firebase.auth().signOut().then(() => {
            window.location.href = "login.html";
          });
        };
      }

      if (buddyPicker) buddyPicker.style.display = ""; // show picker
      loadChosenBuddy(user.uid);

    } else {
      if (authBtn) {
        authBtn.innerText = "Login";
        authBtn.onclick = () => { window.location.href = "login.html"; };
      }
      if (buddyPicker) buddyPicker.style.display = "none";
    }
  });
});

// ----------------------------
// Save selection to Firestore + feedback
// ----------------------------
function selectBuddy(buddyName) {
  const user = firebase.auth().currentUser;
  if (!user) {
    alert("Please log in to select your buddy.");
    return;
  }

  const info = buddyInfo[buddyName] || { title: buddyName };

  firebase.firestore().collection("users").doc(user.uid).update({
    chosenBuddy: buddyName
  })
  .then(() => {
    // Visual confirmation
    alert(`${info.title} selected successfully!`);

    // Voice confirmation (child-robot style if Vivi)
    const confirmLine = `You have chosen ${info.title} as your lab buddy.`;
    speakForBuddy(buddyName, confirmLine);

    // Optional: navigate like your previous flow
    // (keep it if you want the old behavior)
    setTimeout(() => {
      window.location.href = "/dashboard.html";
    }, 700);
  })
  .catch((error) => {
    console.error("Error selecting buddy:", error);
    alert("Something went wrong. Please try again.");
  });
}

// ----------------------------
// Load Buddy to Display + popup
// ----------------------------
function loadChosenBuddy(uid) {
  firebase.firestore().collection("users").doc(uid).get()
    .then((doc) => {
      if (doc.exists) {
        const buddyName = doc.data().chosenBuddy || "Ray";
        const info = buddyInfo[buddyName] || buddyInfo["Ray"];

        // Main buddy display (floating helper)
        const imgEl = document.getElementById("labBuddyImg");
        const msgEl = document.getElementById("labBuddyMsg") || document.getElementById("labBuddySpeech");
        const labBuddyEl = document.getElementById("labBuddy");

        if (imgEl) imgEl.src = info.img || "";
        if (msgEl) msgEl.innerText = `Hi, I'm ${info.title}, your Lab Buddy!`;
        if (labBuddyEl) {
          labBuddyEl.style.display = "flex";
          labBuddyEl.style.opacity = 0;
          labBuddyEl.style.transform = 'translateY(12px)';
          setTimeout(() => {
            labBuddyEl.style.transition = 'all 300ms ease';
            labBuddyEl.style.opacity = 1;
            labBuddyEl.style.transform = 'translateY(0)';
          }, 50);
        }

        // Optional: Bottom-right popup (if you created it)
        const popupImg = document.getElementById("labBuddyPopupImg");
        const popupName = document.getElementById("labBuddyPopupName");
        const popupDesc = document.getElementById("labBuddyPopupDesc");
        const popupQuote = document.getElementById("labBuddyPopupQuote");
        const popupFact = document.getElementById("labBuddyPopupFact");
        const popupMission = document.getElementById("labBuddyPopupMission");

        if (popupImg) popupImg.src = info.img || "";
        if (popupName) popupName.innerText = info.title || "";
        if (popupDesc) popupDesc.innerText = info.description || "";
        if (popupQuote) popupQuote.innerText = info.favoriteQuote ? `"${info.favoriteQuote}"` : "";
        if (popupFact) popupFact.innerText = info.funFact || "";
        if (popupMission) popupMission.innerText = info.mission || "";

        window.currentLabBuddy = buddyName;
      }
    })
    .catch((error) => {
      console.error("Error loading buddy:", error);
    });
}

// ----------------------------
// Modal show/close helpers
// ----------------------------
function showBuddyDetails(buddyName) {
  const info = buddyInfo[buddyName];
  if (!info) return;

  const modal = document.getElementById('buddyDetailModal');
  if (!modal) return;

  const img = document.getElementById('buddyDetailImg');
  const nameEl = document.getElementById('buddyDetailName');
  const descEl = document.getElementById('buddyDetailDesc');

  // New elements for extra info
  const quoteEl = document.getElementById('buddyFavoriteQuote');
  const funFactEl = document.getElementById('buddyFunFact');
  const missionEl = document.getElementById('buddyMission');

  if (img) img.src = info.img || "";
  if (nameEl) nameEl.innerText = info.title || "";
  if (descEl) descEl.innerText = info.description || "";

  if (quoteEl) quoteEl.innerText = info.favoriteQuote ? `"${info.favoriteQuote}"` : "";
  if (funFactEl) funFactEl.innerText = info.funFact || "";
  if (missionEl) missionEl.innerText = info.mission || "";

  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');

  // 🔊 Speak the intro line when details open
  // (clicking the card counts as a user gesture, so autoplay is allowed)
  speakForBuddy(buddyName);
}

function closeBuddyModal() {
  const modal = document.getElementById('buddyDetailModal');
  if (!modal) return;
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
  stopSpeaking();
}


// *****************************

// // ============================
// // Assistant Modal Setup
// // ============================
// document.addEventListener("DOMContentLoaded", () => {
//   const assistModal = document.getElementById("buddyAssistModal");
//   const assistClose = document.getElementById("buddyAssistClose");
//   const assistImg = document.getElementById("assistBuddyImg");
//   const assistGreeting = document.getElementById("assistGreeting");

//   if (!assistModal) return;

//   // Close button
//   if (assistClose) {
//     assistClose.addEventListener("click", () => {
//       assistModal.style.display = "none";
//       stopSpeaking();
//     });
//   }

//   // Expose a function to open the assistant modal
//   window.openAssistantModal = function () {
//     if (!window.currentLabBuddy) window.currentLabBuddy = "Ray"; // fallback
//     const info = buddyInfo[window.currentLabBuddy] || buddyInfo.Ray;

//     // Show chosen buddy
//     if (assistImg) assistImg.src = info.img || "";
//     if (assistGreeting) assistGreeting.innerText = `Hello! I'm ${info.title}, your lab buddy!`;

//     assistModal.style.display = "flex";
//     assistModal.setAttribute("aria-hidden", "false");

//     // Speak greeting
//     speakForBuddy(window.currentLabBuddy, info.introVoiceText);
//   };
// });

// // ***********************

