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
                error: "Name and message are required"
            });
        }

        const token = process.env.BOT_TOKEN;
        const chatId = process.env.CHAT_ID;

        if (!token || !chatId) {
            return res.status(500).json({
                error: "Telegram configuration is missing"
            });
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
                    text: `New website message\n\nName: ${name}\nMessage: ${message}`
                })
            }
        );

        const result = await telegramResponse.json();

        if (!result.ok) {
            return res.status(502).json({
                error: "Telegram could not deliver the message"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Telegram notification sent"
        });

    } catch (error) {
        return res.status(500).json({
            error: "Server error"
        });
    }
}
