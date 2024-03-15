// Function to handle asking a question
function askQuestion() {
    // Get the question input element
    var questionInput = document.getElementById("questionInput");
    // Trim the input value
    var question = questionInput.value.trim();
    // Check if the question is empty
    if (question === "") {
        return;
    }

    // Clear the AI hello message
    document.getElementById("ai-hello").textContent = "";

    // Get the chat container
    var chatContainer = document.getElementById("chatContainer");

    // Get the current date and time
    var currentDate = new Date();
    var hours = currentDate.getHours();
    var minutes = currentDate.getMinutes();
    var currentTime = hours + ":" + minutes;

    // Create and append the user message
    var userMessage = document.createElement("div");
    userMessage.classList.add("user");
    userMessage.innerHTML = '<p>' + question + '</p><span class="time-right">User: ' + currentTime + '</span>';
    chatContainer.appendChild(userMessage);

    // Create and append the loading message
    var loadingMessage = document.createElement("div");
    loadingMessage.classList.add("ai");
    loadingMessage.innerHTML = '<p>Thinking...</p><span class="time-left">Tonnam AI: ' + currentTime + '</span>';
    chatContainer.appendChild(loadingMessage);

    // Reset the question input value
    questionInput.value = "";

    // Send the user's question to the server
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=AIzaSyDkp9230gxAiduhRuv-l6lLbj_zlDrfl9A");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                // Remove the loading message
                chatContainer.removeChild(loadingMessage);

                // Parse the response data
                var data = JSON.parse(xhr.responseText);
                var answer = data.candidates[0].content.parts[0].text;

                // Process and format the answer
                answer = answer.replace(/gemini/ig, "Tonnam");
                answer = answer.replace(/google/ig, "Rachata.tn");
                answer = answer.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
                answer = answer.replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>');
                answer = answer.replace(/\*\*/g, "</b>");
                answer = answer.replace(/^\*(.*?)/gm, "<li>$1");
                answer = answer.replace(/\n/g, "<br>");

                // Create and append the AI message
                var aiMessage = document.createElement("div");
                aiMessage.classList.add("ai");
                aiMessage.innerHTML = '<p>' + answer + '</p><span class="time-left">AI: ' + currentTime + '</span>';
                chatContainer.appendChild(aiMessage);

                // Scroll to the bottom of the chat container
                chatContainer.scrollTop = chatContainer.scrollHeight;
                document.getElementById('scroll').scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
            } else if (xhr.status === 500) {
                // Handle server error
                var answer = "Sorry I Don't know about " + question;
                var aiMessage = document.createElement("div");
                aiMessage.classList.add("ai");
                aiMessage.innerHTML = '<p>' + answer + '</p><span class="time-left">AI: ' + currentTime + '</span>';
                chatContainer.appendChild(aiMessage);

                chatContainer.scrollTop = chatContainer.scrollHeight;
                document.getElementById('scroll').scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
            } else {
                console.error("Error:", xhr.status);
            }
        }
    };

    // Prepare data to send
    var jsonData = JSON.stringify({
        "contents": [{
            "role": "user",
            "parts": [{
                "text": question
            }]
        }],
        "generationConfig": {
            "temperature": 0.9,
            "topK": 1,
            "topP": 1,
            "maxOutputTokens": 2048,
            "stopSequences": []
        },
        "safetySettings": [{
            "category": "HARM_CATEGORY_HARASSMENT",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
            "category": "HARM_CATEGORY_HATE_SPEECH",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
            "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
            "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE"
        }
        ]
    });

    // Send the request
    xhr.send(jsonData);

    // Scroll to the bottom of the chat container
    document.getElementById('scroll').scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
}

// Event listener for pressing enter in the question input
document.getElementById("questionInput").addEventListener("keydown", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        askQuestion();
    }
});
