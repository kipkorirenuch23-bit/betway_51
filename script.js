document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("contactForm");
    const status = document.getElementById("status");
    const button = document.getElementById("sendBtn");

    console.log("JavaScript loaded successfully");

    if (!form || !status || !button) {
        console.error("Required HTML elements not found.");

        if (status) {
            status.textContent = "Form connection error.";
        }

        return;
    }

    status.textContent = "JavaScript is running!";

    button.addEventListener("click", function () {
        console.log("Send button clicked");
    });

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const message = document.getElementById("message").value.trim();

        if (!name || !message) {
            status.textContent = "Please complete all fields.";
            return;
        }

        status.textContent = "Sending message...";

        button.disabled = true;

        try {

            const response = await fetch("/api/notify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    message: message
                })
            });

            const result = await response.json();

            console.log("Server response:", result);

            if (!response.ok) {

                let errorMessage = result.error || "Message failed.";

                if (result.missing) {
                    errorMessage +=
                        " | BOT_TOKEN missing: " +
                        result.missing.BOT_TOKEN +
                        " | CHAT_ID missing: " +
                        result.missing.CHAT_ID;
                }

                throw new Error(errorMessage);
            }

            status.textContent = "Message sent successfully!";

            form.reset();

        } catch (error) {

            console.error("Sending error:", error);

            status.textContent = "Error: " + error.message;

        } finally {

            button.disabled = false;

        }

    });

});
