module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  try {
    const { phone, message } = req.body || {};

    if (
      typeof phone !== "string" ||
      typeof message !== "string" ||
      !phone.trim() ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        error: "Please provide a phone number and message."
      });
    }

    if (phone.length > 25 || message.length > 2000) {
      return res.status(400).json({
        success: false,
        error: "Input is too long."
      });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return res.status(500).json({
        success: false,
        error: "Telegram configuration is missing."
      });
    }

    const telegramMessage =
      "New contact form submission\n\n" +
      "Phone: " + phone.trim() + "\n\n" +
      "Message: " + message.trim();

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: telegramMessage
        })
      }
    );

    const result = await telegramResponse.json();

    if (!telegramResponse.ok || !result.ok) {
      return res.status(502).json({
        success: false,
        error: "Telegram could not deliver the message."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification sent successfully."
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "An unexpected server error occurred."
    });
  }
};
