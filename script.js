document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("messageForm");
  const status = document.getElementById("status");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const phone = document.getElementById("phone").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!phone || !message) {
      status.textContent = "Please fill in all fields.";
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
          phone,
          message
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Message could not be sent.");
      }

      status.textContent = "Message sent successfully!";
      form.reset();

    } catch (error) {
      status.textContent = error.message;
    }
  });
});
