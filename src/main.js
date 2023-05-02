import { Telegraf, session } from "telegraf";
import { message } from "telegraf/filters";
import { proccessVoiceMessage, proccessTextMessage } from "./logic.js";
import { startSession } from "./utils.js";
import config from "config";
const bot = new Telegraf(config.get("TELEGRAM_TOKEN"));
const allowedUsers = config.get("ALLOWED_USERS");
bot.use(session());
bot.use(async (ctx, next) => {
  const userId = ctx.from.id;
  if (allowedUsers.includes(userId)) {
    await next();
  } else {
    ctx.reply("Извините, у вас нет доступа к этому боту.");
  }
});

bot.command("temp", async (ctx) => {
  ctx.session ??= startSession();
  const userId = ctx.from.id;
  if (allowedUsers.includes(userId)) {
    const keyboard = [];
    for (let i = 1; i <= 10; i++) {
      keyboard.push([{ text: i.toString(), callback_data: i.toString() }]);
    }
    ctx.reply(
      `Это свойство позволяет контролировать степень "рискованности" ответов, которые будет предоставлять бот. Чем меньше значение, тем более предсказуемыми будут ответы. Чем больше значение, тем более "рискованными" и творческими могут быть ответы.`,
      {
        reply_markup: {
          inline_keyboard: keyboard,
          one_time_keyboard: true,
        },
      }
    );

    bot.action(/^(?:[1-9]|10)$/, async (ctx) => {
      ctx.session.selectedTemp = ctx.match[0] / 10;
      await ctx.answerCbQuery(`Вы установили значение ${ctx.session.selectedTemp * 10}`);
    });
  } else {
    ctx.reply("Извините, у вас нет доступа к этой команде.");
  }
});

bot.on(message("voice"), async (ctx) => {
  ctx.session ??= startSession();
  await proccessVoiceMessage(ctx);
});

bot.on(message("text"), async (ctx) => {
  ctx.session ??= startSession();
  await proccessTextMessage(ctx);
});

bot.launch();

process.once("SIGINT", () => {
  bot.stop("SIGINT");
});

process.once("SIGTERM", () => {
  bot.stop("SIGTERM");
});
