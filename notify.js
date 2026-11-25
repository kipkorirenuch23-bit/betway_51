const form = document.getElementById("contactForm");
const status = document.getElementById("status");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

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
            body: JSON.stringify({
                name,
                message
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Message failed.");
        }

        status.textContent = "Message sent successfully!";
        form.reset();

    } catch (error) {
        status.textContent = "Could not send message. Please try again.";
        console.error(error);
    }
});
