# Breakfast Suggestor Telegram Bot 🍳

A simple Telegram bot for couples to decide on breakfast. The wife picks the breakfast type, and the husband receives a notification.

## Setup Instructions

1. **Create a Bot**:
   - Talk to [@BotFather](https://t.me/botfather) on Telegram.
   - Use `/newbot` to create your bot and get the **API Token**.

2. **Configure Environment Variables**:
   - Create a `.env` file in the project root (copy from `.env.example`).
   - Paste your `BOT_TOKEN`.
   - Leave `WIFE_CHAT_ID` and `HUSBAND_CHAT_ID` blank for now.

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Run the Bot**:
   ```bash
   npm start
   ```

5. **Get your Chat IDs**:
   - Both you and your wife should find your bot on Telegram and send `/start`.
   - The bot will reply with your respective **Chat IDs**.
   - Copy these IDs and paste them into your `.env` file:
     ```env
     WIFE_CHAT_ID=12345678
     HUSBAND_CHAT_ID=87654321
     ```
   - Restart the bot.

## Usage

- **Wife**: Send `/suggest` to the bot to see the breakfast menu. Pick an option.
- **Husband**: Will automatically receive a notification when a selection is made!
