export default async function handler(req, res) {
    // Allow POST requests only
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {
        // Get form data
        const { name, message } = req.body || {};

        // Validate form fields
        if (
            typeof name !== "string" ||
            typeof message !== "string" ||
            !name.trim() ||
            !message.trim()
        ) {
            return res.status(400).json({
                error: "Name and message are required."
            });
        }

        // Read Telegram environment variables
        const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

        // Diagnostic: identify which variable is missing
        if (!BOT_TOKEN || !CHAT_ID) {
            return res.status(500).json({
                error: "Telegram configuration is missing.",
                missing: {
                    BOT_TOKEN: !BOT_TOKEN,
                    CHAT_ID: !CHAT_ID
                }
            });
        }

        // Send message to Telegram
        const telegramResponse = await fetch(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text:
                        `New website message\n\n` +
                        `Name: ${name.trim()}\n` +
                        `Message: ${message.trim()}`
                })
            }
        );

        const telegramResult = await telegramResponse.json();

        // Check Telegram response
        if (!telegramResponse.ok || !telegramResult.ok) {
            console.error("Telegram error:", telegramResult);

            return res.status(502).json({
                error: "Telegram could not deliver the message."
            });
        }

        // Success
        return res.status(200).json({
            success: true,
            message: "Message sent successfully."
        });

    } catch (error) {
        console.error("API error:", error);

        return res.status(500).json({
            error: "Internal server error."
        });
    }
}
