//

// Get correct elements
const chatContainer = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-btn");

// Replace with your Gemini API Key
const GEMINI_API_KEY = "//";

// Change model to the correct one
const MODEL_NAME = "gemini-1.5-flash";

// Add a message to chat
function addMessage(text, sender, fullText = null) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", sender);
    messageElement.innerHTML = marked.parse(text);

    if (fullText && fullText.length > text.length) {
        const readMoreBtn = document.createElement("button");
        readMoreBtn.textContent = "Read More";
        readMoreBtn.classList.add("read-more-btn");

        readMoreBtn.onclick = function () {
            messageElement.innerHTML = marked.parse(fullText);
        };

        messageElement.appendChild(readMoreBtn);
    }

    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Show welcome message when page loads
document.addEventListener("DOMContentLoaded", function () {
    addMessage("Welcome, Explorer! What topic should we explore today?", "bot");
});

async function sendMessage() {
    const message = userInput.value.trim();
    if (message === "") return;

    addMessage(message, "user");
    userInput.value = "";

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ role: "user", parts: [{ text: message }] }]
                })
            }
        );

        const data = await response.json();
        console.log("API Raw Response:", data);

        if (!response.ok || data.error) {
            throw new Error(data.error?.message || "API request failed");
        }

        let fullText = data.candidates[0].content.parts[0].text.trim();
        let preview = fullText.length > 250 ? fullText.substring(0, 250) + "..." : fullText;
        addMessage(preview, "bot", fullText);

    } catch (error) {
        console.error("Error:", error);
        addMessage(`⚠️ Sorry, something went wrong: ${error.message}`, "bot");
    }
}

// Event listeners
sendButton.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendMessage();
});


