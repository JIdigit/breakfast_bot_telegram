require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error('Error: BOT_TOKEN is not defined in .env');
  process.exit(1);
}

// Dummy server for Render port binding
const http = require('http');
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot is running');
}).listen(PORT, () => console.log(`Health check server listening on port ${PORT}`));

const bot = new Telegraf(token);

// Configuration for users
const WIFE_ID = process.env.WIFE_CHAT_ID;
const HUSBAND_ID = process.env.HUSBAND_CHAT_ID;

const breakfastOptions = [
  '🍳 Омлет',
  '🧀 Омлет с сыром и зеленью',
  '🥣 Каша',
  '🍳 Яичница'
];

const loveMessages = [
  "Я тебя очень люблю! ❤️",
  "Ты лучшая жена на свете! 😘",
  "Хорошего тебе дня, любимая! ✨",
  "Целую тебя! 💖"
];

bot.start((ctx) => {
  const chatId = ctx.chat.id.toString();
  ctx.reply(`Добро пожаловать в помощник по завтракам! 🍳\n\nТвой Chat ID: ${chatId}\n\nИспользуй /suggest, чтобы выбрать завтрак.\n\nКстати, помни, что муж тебя очень сильно любит! ❤️`);
});

bot.command('suggest', (ctx) => {
  const chatId = ctx.chat.id.toString();

  if (WIFE_ID && chatId !== WIFE_ID) {
    return ctx.reply("Извини, только жена может выбирать завтрак! 😉");
  }

  const buttons = breakfastOptions.map(option => [Markup.button.callback(option, `pick_${option}`)]);
  const randomLove = loveMessages[Math.floor(Math.random() * loveMessages.length)];

  ctx.reply(`Что ты хочешь на завтрак сегодня, любимая? 🥐\n\n${randomLove}`, Markup.inlineKeyboard(buttons));
});

bot.action(/pick_(.+)/, async (ctx) => {
  const selection = ctx.match[1];
  const randomLove = loveMessages[Math.floor(Math.random() * loveMessages.length)];

  await ctx.answerCbQuery();
  await ctx.editMessageText(`Отличный выбор: ${selection} ✨\nУже передаю мужу...\n\n${randomLove}`);

  if (HUSBAND_ID) {
    console.log(`Уведомляю мужа по ID: ${HUSBAND_ID}`);
    try {
      await bot.telegram.sendMessage(HUSBAND_ID, `📢 Решение по завтраку!\n\nЖена выбрала: *${selection}* 🍳\nПора готовить!`, { parse_mode: 'Markdown' });
      ctx.reply("Муж уведомлен! ✅");
    } catch (error) {
      console.error('Ошибка уведомления:', error.message);
      if (error.description && error.description.includes('chat not found')) {
        ctx.reply("Выбор записан, но я не нашел твоего мужа. 🧐\n\nОн должен нажать 'Start' в этом боте!");
      } else {
        ctx.reply(`Ошибка: ${error.message}`);
      }
    }
  } else {
    ctx.reply("Выбор сделан, но HUSBAND_CHAT_ID не настроен.");
  }
});

bot.launch().then(() => {
  console.log('Breakfast Suggestor Bot is running...');
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
