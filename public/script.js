document.addEventListener("DOMContentLoaded", () => {
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-btn");
    const chatBox = document.getElementById("chat-box");

    // Increase chat box height
    chatBox.style.height = "400px"; // Adjusted height for larger response area

    // Function to send message
    async function sendMessage() {
        const query = userInput.value.trim();
        if (!query) return;

        // Append user message to chat
        appendMessage("user", query);
        userInput.value = ""; // Clear input field

        try {
            const response = await fetch("http://localhost:3000/api/gemini", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query })
            });

            const data = await response.json();
            formatAndAppendAIResponse(data.response || "No response from AI.");
        } catch (error) {
            console.error("Error:", error);
            appendMessage("ai", "Error fetching response. Try again.");
        }
    }

    // Function to append messages
    function appendMessage(sender, text) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", sender);
        messageDiv.innerHTML = `<p>${text}</p>`;
        messageDiv.style.borderRadius = "15px"; // Rounded corners
        messageDiv.style.padding = "10px";
        messageDiv.style.margin = "5px 0";
        messageDiv.style.maxWidth = "80%";
        messageDiv.style.wordWrap = "break-word";
        messageDiv.style.border = "2px solid #000"; // Added border

        if (sender === "user") {
            messageDiv.style.backgroundColor = "#d1e7dd"; // Light green for user messages
            messageDiv.style.alignSelf = "flex-end";
        } else {
            messageDiv.style.backgroundColor = "#f8d7da"; // Light red for AI responses
            messageDiv.style.alignSelf = "flex-start";
        }
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Function to format and append AI response
    function formatAndAppendAIResponse(text) {
        const formattedText = text.replace(/\n/g, "<br>").replace(/(https?:\/\/\S+)/g, '<a href="$1" target="_blank">$1</a>'); // Preserve new lines and highlight links
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", "ai");
        messageDiv.innerHTML = `<p>${formattedText}</p>`;
        messageDiv.style.borderRadius = "15px"; // Rounded corners
        messageDiv.style.padding = "10px";
        messageDiv.style.margin = "5px 0";
        messageDiv.style.maxWidth = "80%";
        messageDiv.style.wordWrap = "break-word";
        messageDiv.style.backgroundColor = "#f8d7da"; // Light red for AI responses
        messageDiv.style.alignSelf = "flex-start";
        messageDiv.style.border = "2px solid #000"; // Added border

        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Event listener for button click
    sendButton.addEventListener("click", sendMessage);

    // Event listener for Enter key
    userInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent line break
            sendMessage();
        }
    });
});
