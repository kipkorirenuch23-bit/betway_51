module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  try {
    const { text, form } = req.body || {};

    if (
      typeof text !== "string" ||
      !text.trim()
    ) {
      return res.status(400).json({
        success: false,
        error: "Message is required"
      });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      throw new Error("Telegram environment variables missing");
    }

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: chatId,
          text:
            `NEW WEBSITE SUBMISSION\n\n` +
            `Form: ${form || "Website form"}\n\n` +
            `${text}`
        })
      }
    );

    const result = await telegramResponse.json();

    if (!telegramResponse.ok || !result.ok) {
      console.error("Telegram error:", result);

      return res.status(502).json({
        success: false,
        error: "Telegram delivery failed"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification delivered"
    });

  } catch (error) {
    console.error("API error:", error);

    return res.status(500).json({
      success: false,
      error: "Server notification failed"
    });
  }
};
