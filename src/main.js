import { Telegraf, session } from "telegraf";
import { message } from "telegraf/filters";
import { proccessVoiceMessage, proccessTextMessage } from "./logic.js";
import config from "config";

export const INITIAL_SESSION = {
  messages: [],
};

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

bot.start(async (ctx) => {
  ctx.reply("Начнем? GPTChat готов :) ");
  ctx.session = INITIAL_SESSION;
  await ctx.reply("Жду вашего сообщения");
});

bot.on(message("voice"), async (ctx) => {
  ctx.session ??= INITIAL_SESSION;
  await proccessVoiceMessage(ctx);
});

bot.on(message("text"), async (ctx) => {
  ctx.session ??= INITIAL_SESSION;
  await proccessTextMessage(ctx);
});

bot.launch();

process.once("SIGINT", () => {
  bot.stop("SIGINT");
});

process.once("SIGTERM", () => {
  bot.stop("SIGTERM");
});
