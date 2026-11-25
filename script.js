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

    // Confirm button clicks
    button.addEventListener("click", function () {
        console.log("Send button clicked");
    });

    // Handle form submission
    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        console.log("Form submission detected!");

        const name = document.getElementById("name").value.trim();
        const message = document.getElementById("message").value.trim();

        if (!name || !message) {
            status.textContent = "Please complete all fields.";
            return;
        }

        status.textContent = "Button detected! Sending...";

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

            if (!response.ok) {
                throw new Error(
                    result.error || "Message failed."
                );
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
