const chatBot = document.getElementById("chatbot-frame");
const botOpen = document.getElementById("open-bot");
const botClose = document.getElementById("close-bot");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-text");
const chatBox = document.getElementById("chatbox");
const rasaURL = "http://localhost:5005/webhooks/rest/webhook";

// Event Listeners
botOpen.addEventListener("click", openChatBot);
botClose.addEventListener("click", closeChatBot);
userInput.addEventListener("input", toggleSendButton);
userInput.addEventListener("keyup", handleKeySubmit);
sendButton.addEventListener("click", handleSubmit);

// Show Chat Bot
function openChatBot() {
  chatBot.classList.add("show-frame");
  botOpen.classList.add("hide-open-bot");
}

// Hide Chat Bot
function closeChatBot() {
  chatBot.classList.remove("show-frame");
  botOpen.classList.remove("hide-open-bot");
}

// Change Colour and Disable Send Button if No Input is Provided
function toggleSendButton() {
  if (userInput.value.trim() === "") {
    sendButton.classList.remove("enabled");
    sendButton.disabled = true;
  } else {
    sendButton.classList.add("enabled");
    sendButton.disabled = false;
  }
}

// Press Enter to Send Message
function handleKeySubmit(event) {
  if (event.key === "Enter") {
    handleSubmit();
  }
}

// Resets Input and Calls addUserMessage to Add User Input to Chat
// Calls getBotReply and Passes User Input
function handleSubmit() {
  if (userInput.value.trim() !== "") {
    const userMessage = userInput.value;

    userInput.value = "";
    sendButton.classList.remove("enabled");
    sendButton.disabled = true;

    addUserMessage(userMessage);
    getBotReply(userMessage);
  }
}

// Add User Message to Chat
function addUserMessage(userMessage) {
  addMessageHeader("user");
  createUserChatBubble(userMessage);
  scrollToBottom();
}

// Take User Message and Calls addBotReply to Start Process of Adding Bot Reply to Chat
async function getBotReply(userMessage) {
  disableInput();

  try {
    const apiResponse = await fetch(rasaURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userMessage }),
    });

    const botReply = await apiResponse.json();
    // If Empty/Null Reply
    if (!botReply[0]) {
      botReply[0] = {
        buttons: [
          {
            title: "Contact Us",
            payload: "https://hitachi-systems.co.in/contact.php",
          },
        ],
        text: "I'm having trouble understanding. Could you clarify or reach out to us for personalized help?",
      };
      addBotReply(botReply[0]);
    } else {
      addBotReply(botReply[0]);
    }
  } catch (error) {
    // Fallback In Case of No Server Connectivity
    console.error(error);
    const botReply = {
      buttons: [
        {
          title: "Contact Us",
          payload: "https://hitachi-systems.co.in/contact.php",
        },
      ],
      text: "I'm having trouble connecting to our servers. Reach out to us for personalized help.",
    };
    addBotReply(botReply);
  }
}

// Add Bot Message to Chat
function addBotReply(botReply) {
  // Check if header has to be added
  if (!chatBox.lastChild.classList.contains("outgoing")) {
    addMessageHeader("bot");
  }
  // Displays a Typing Indicator for 1500ms
  handleTypingIndicator();
  scrollToBottom();
  setTimeout(() => {
    handleTypingIndicator();
    createBotChatBubble(botReply);
    enableInput();
    scrollToBottom();
  }, 1000);
}

// Creates Bubble for User Input
function createUserChatBubble(userMessage) {
  let p = document.createElement("p");
  p.innerHTML = userMessage;

  let chatBubble = document.createElement("div");
  chatBubble.classList.add("chat-bubble", "incoming");
  chatBubble.appendChild(p);

  let messageDiv = document.createElement("div");
  messageDiv.classList.add("message", "incoming");
  messageDiv.appendChild(chatBubble);

  chatBox.appendChild(messageDiv);
}

// Creates Bubble for Bot Reply
function createBotChatBubble(botReply) {
  let p = document.createElement("p");
  p.innerHTML = botReply.text;

  let chatBubble = document.createElement("div");
  chatBubble.classList.add("chat-bubble", "outgoing");
  chatBubble.appendChild(p);

  if (botReply.buttons) {
    chatBubble = addButtons(chatBubble, botReply.buttons);
  }

  let messageDiv = document.createElement("div");
  messageDiv.classList.add("message", "outgoing");
  messageDiv.appendChild(chatBubble);

  chatBox.appendChild(messageDiv);
}

// Adds Buttons from Buttons Array (buttonArray) of Bot Reply to chatBubble
function addButtons(chatBubble, buttonArray) {
  buttonArray.forEach((button) => {
    buttonElement = document.createElement("button");
    buttonElement.classList.add("more-info");
    buttonElement.textContent = button.title;
    buttonElement.addEventListener("click", () => {
      handleClick(button.payload);
    });
    chatBubble.appendChild(buttonElement);
  });

  return chatBubble;
}

// Handles Button Clicks
// Opens Page in New Tab if Button is a Link Otherwise Sends Payload as Normal Message to Bot
function handleClick(payload) {
  if (payload.substring(0, 5) === "https") {
    window.open(payload, "_blank");
  } else {
    getBotReply(payload);
  }
}

// Adds Sender Info Header
function addMessageHeader(sender) {
  let senderInfo = document.createElement("div");
  senderInfo.classList.add("sender-info", sender);
  let p = document.createElement("p");

  if (sender === "user") {
    p.innerHTML = "You";
  } else if (sender === "bot") {
    p.innerHTML = "HitaBot";
    let botIcon = document.createElement("div");
    botIcon.classList.add("bot-icon");
    senderInfo.appendChild(botIcon);
  }

  senderInfo.appendChild(p);
  chatBox.appendChild(senderInfo);
}

// Adds a Typing Indicator and Removes it if Already Present
function handleTypingIndicator() {
  if (chatBox.lastChild.classList.contains("typing-indicator")) {
    chatBox.lastChild.remove();
  } else {
    let typingIndicator = document.createElement("div");
    typingIndicator.classList.add("typing-indicator");
    chatBox.appendChild(typingIndicator);
  }
}

// Disable Button Press and Input
function disableInput() {
  userInput.disabled = true;
  userInput.classList.add("disable-input");
  const chatBubbles = document.querySelectorAll(".chat-bubble");
  chatBubbles.forEach((chatBubble) => {
    chatBubble.classList.add("disable-bubble");
  });
}

// Enable Button Press and Input
function enableInput() {
  userInput.disabled = false;
  userInput.classList.remove("disable-input");
  userInput.focus();
  const chatBubbles = document.querySelectorAll(".chat-bubble");
  chatBubbles.forEach((chatBubble) => {
    chatBubble.classList.remove("disable-bubble");
  });
}

function scrollToBottom() {
  chatBox.scrollTop = chatBox.scrollHeight - chatBox.clientHeight;
}
