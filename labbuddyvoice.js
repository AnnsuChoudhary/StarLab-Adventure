//

// labbuddyvoice.js
(function () {
  const $ = (id) => document.getElementById(id);

  document.addEventListener("DOMContentLoaded", () => {
    // Elements
    const buddyWidget = $("labBuddy");
    const buddyImgSmall = $("labBuddyImg");

    const modal = $("buddyAssistModal");
    const closeBtn = $("buddyAssistClose");
    const bigImg = $("assistBuddyImg");
    const greeting = $("assistGreeting");

    const inputEl = $("assistText");
    const sendBtn = $("assistSendBtn");
    const voiceBtn = $("assistVoiceBtn");

    // Overlay controls
    const captionToggleBtn = $("captionToggle");
    const stopFloatingBtn = $("assistStopFloating");
    const captionOverlay = $("captionOverlay");

    // State
    let captionsOn = false;
    let currentUtterance = null;

    // --- Open/Close ---
    if (buddyWidget) {
      buddyWidget.style.cursor = "pointer";
      buddyWidget.addEventListener("click", () => {
        modal.classList.contains("show")
          ? closeAssistModal()
          : openAssistModal();
      });
    }
    if (closeBtn) closeBtn.addEventListener("click", closeAssistModal);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("show"))
        closeAssistModal();
    });

    // --- Voice recognition ---
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null;
    if (SR) {
      recognition = new SR();
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (ev) => {
        const text = ev.results?.[0]?.[0]?.transcript || "";
        inputEl.value = text;
        if (text.trim()) sendBtn.click();
      };
      recognition.onerror = (ev) =>
        console.warn("Speech recognition:", ev.error);
    } else if (voiceBtn) {
      voiceBtn.disabled = true;
      voiceBtn.title = "Voice input not supported in this browser";
    }
    if (voiceBtn) voiceBtn.addEventListener("click", () => recognition && recognition.start());

    // --- Sending ---
    sendBtn.addEventListener("click", () => {
      const text = (inputEl.value || "").trim();
      if (!text) return;
      stopSpeaking();
      inputEl.value = "";
      getAssistantReply(text);
    });
    inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") sendBtn.click();
    });

    // --- Floating Stop Button ---
    if (stopFloatingBtn) {
      stopFloatingBtn.addEventListener("click", stopSpeaking);
    }

    // --- Caption Toggle Button ---
    if (captionToggleBtn) {
      captionToggleBtn.addEventListener("click", () => {
        captionsOn = !captionsOn;
        captionToggleBtn.setAttribute("aria-pressed", captionsOn);
        if (!captionsOn) {
          captionOverlay.hidden = true;
          captionOverlay.textContent = "";
        } else {
          // If turned on mid-speech, show immediately
          captionOverlay.hidden = false;
        }
      });
    }

    // ---------- Helpers ----------
    function openAssistModal() {
      if (!modal) return;
      const src = buddyImgSmall?.src || "";
      if (src) bigImg.src = src;

      const buddyKey =
        (window.currentLabBuddy && String(window.currentLabBuddy)) ||
        "your Lab Buddy";
      greeting.textContent = `Hello! I'm ${buddyKey}, your lab buddy!`;

      modal.classList.add("show");
      modal.setAttribute("aria-hidden", "false");

      speakAssistant(greeting.textContent);
    }

    function closeAssistModal() {
      stopSpeaking();
      modal.classList.remove("show");
      modal.setAttribute("aria-hidden", "true");
      captionOverlay.hidden = true;
    }

    // --- Stop Speaking ---
    function stopSpeaking() {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      currentUtterance = null;
      captionOverlay.textContent = "";
      captionOverlay.hidden = true;
    }

    // --- API ---
    async function getAssistantReply(userText) {
      const GEMINI_API_KEY = "//";
      const apiUrl =
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
        GEMINI_API_KEY;

      const requestBody = {
        contents: [{ role: "user", parts: [{ text: userText }] }],
      };

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        console.log(data);

        let reply = "Sorry, I couldn’t get a response.";
        if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
          reply = data.candidates[0].content.parts[0].text;
        }

        speakAssistant(reply);
      } catch (err) {
        console.error(err);
        speakAssistant("Error contacting the AI service.");
      }
    }

    // --- Speech with captions ---
    function speakAssistant(text) {
  if (!text) return;

  // clear captions first
  captionOverlay.textContent = "";
  captionOverlay.hidden = !captionsOn;

  // Ensure we know which buddy is selected
  const buddyName = window.currentLabBuddy || "Ray";

  // Use your existing function in labbuddy.js
  stopSpeaking(); // stop old utterances before new

  // Special handling: Vivi’s robotic mode won’t fire onboundary events, so captions need a different approach
  if (buddyName === "Vivi") {
    // Use the existing special speak
    speakForBuddy("Vivi", text);

    // Captions: display sentence-by-sentence in sync with Vivi's chunks
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    let i = 0;
    const showNext = () => {
      if (!captionsOn || i >= sentences.length) return;
      captionOverlay.textContent = sentences[i].trim();
      captionOverlay.hidden = false;
      i++;
      setTimeout(showNext, 1200); // adjust duration to match Vivi’s faster speaking style
    };
    showNext();
    return;
  }

  // For all other buddies
  const chosenVoice = chooseVoice(buddyInfo[buddyName].voicePrefs || []);
  const utter = new SpeechSynthesisUtterance(text);
  if (chosenVoice) utter.voice = chosenVoice;
  utter.rate = buddyInfo[buddyName].voiceRate || 1.0;
  utter.pitch = buddyInfo[buddyName].voicePitch || 1.0;
  utter.volume = 1.0;

  let sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  let currentSentence = sentences[0]?.trim() || "";
  let words = currentSentence.split(/\s+/);
  let wordIndex = 0, sentenceIndex = 0;

  utter.onboundary = (event) => {
    if (event.name === "word" || event.charIndex !== undefined) {
      if (captionsOn && wordIndex < words.length) {
        captionOverlay.textContent = words.slice(0, wordIndex + 1).join(" ");
        captionOverlay.hidden = false;
        wordIndex++;
      }
      if (wordIndex >= words.length && sentenceIndex < sentences.length - 1) {
        sentenceIndex++;
        currentSentence = sentences[sentenceIndex].trim();
        words = currentSentence.split(/\s+/);
        wordIndex = 0;
        captionOverlay.textContent = "";
      }
    }
  };

  utter.onend = () => {
    captionOverlay.textContent = "";
    captionOverlay.hidden = true;
  };

  window.speechSynthesis.speak(utter);
}


  });
})();

