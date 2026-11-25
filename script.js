document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("contactForm");
    const status = document.getElementById("status");

    console.log("JavaScript loaded successfully");

    if (!form || !status) {
        console.error("Form or status element not found.");
        return;
    }

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        console.log("Send button clicked");

        const name = document.getElementById("name").value.trim();
        const message = document.getElementById("message").value.trim();

        if (!name || !message) {
            status.textContent = "Please complete all fields.";
            return;
        }

        status.textContent = "Sending...";

        try {
            const response = await fetch("/api/notify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, message })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Message failed.");
            }

            status.textContent = "Message sent successfully!";
            form.reset();

        } catch (error) {
            console.error("Sending error:", error);
            status.textContent = "Could not send message. Please try again.";
        }
    });
});
