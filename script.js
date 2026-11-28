document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll("form[data-telegram]");

  forms.forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const status = document.getElementById("message");
      const submitButton = form.querySelector('[type="submit"]');

      const fields = Array.from(form.querySelectorAll(
        'input:not([type="password"]):not([type="hidden"]), textarea'
      ));

      const submittedText = fields
        .map(field => {
          const value = field.value.trim();

          if (!value) return null;

          return `${field.name || field.id || "Message"}: ${value}`;
        })
        .filter(Boolean)
        .join("\n");

      if (!submittedText) {
        if (status) status.textContent = "Please enter a message.";
        return;
      }

      if (submitButton) submitButton.disabled = true;
      if (status) status.textContent = "Sending...";

      try {
        const response = await fetch("/api/notify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            text: submittedText,
            form: form.id || "Website form"
          })
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || "Submission failed");
        }

        if (status) {
          status.textContent = "Submitted successfully!";
          status.style.color = "#22c55e";
        }

        form.reset();

      } catch (error) {
        console.error(error);

        if (status) {
          status.textContent = "Unable to send. Please try again.";
          status.style.color = "#ef4444";
        }

      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });
  });
});
