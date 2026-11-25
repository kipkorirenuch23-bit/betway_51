export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {
        const { name, message } = req.body || {};

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

        const BOT_TOKEN = process.env.BOT_TOKEN;
        const CHAT_ID = process.env.CHAT_ID;

        if (!BOT_TOKEN || !CHAT_ID) {
            return res.status(500).json({
                error: "Telegram configuration is missing."
            });
        }

        const telegramResponse = await fetch(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: `New website message\n\nName: ${name.trim()}\nMessage: ${message.trim()}`
                })
            }
        );

        const telegramResult = await telegramResponse.json();

        if (!telegramResponse.ok || !telegramResult.ok) {
            console.error("Telegram error:", telegramResult);

            return res.status(502).json({
                error: "Telegram could not deliver the message."
            });
        }

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
