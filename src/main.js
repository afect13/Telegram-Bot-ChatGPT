import { Telegraf, session } from "telegraf";
import { message } from "telegraf/filters";
import { proccessVoiceMessage, proccessTextMessage } from "./logic.js";
import config from "config";
import forever from "forever";
export const INITIAL_SESSION = {
  messages: [],
};

const bot = new Telegraf(config.get("TELEGRAM_TOKEN"));
const allowedUsers = config.get("ALLOWED_USERS");
bot.use(session());

bot.start((ctx) => {
  const userId = ctx.from.id;
  if (allowedUsers.includes(userId)) {
    ctx.reply("Добро пожаловать!");
    bot.command("new", async (ctx) => {
      ctx.session = INITIAL_SESSION;
      await ctx.reply("Жду вашего  сообщения");
    });
    bot.command("start", async (ctx) => {
      ctx.session = INITIAL_SESSION;
      await ctx.reply("Жду вашего  сообщения");
    });
    bot.on(message("voice"), async (ctx) => {
      ctx.session ??= INITIAL_SESSION;
      await proccessVoiceMessage(ctx);
    });

    bot.on(message("text"), async (ctx) => {
      ctx.session ??= INITIAL_SESSION;
      await proccessTextMessage(ctx);
    });
  } else {
    ctx.reply("Извините, у вас нет доступа к этому боту.");
  }
});

bot.launch();

const child = new forever.Monitor(__filename, {
  max: 10,
  silent: true,
  args: [],
});

child.on("restart", () => {
  console.log("Bot restarted due to an error");
});

child.on("exit", () => {
  console.log("Bot has exited after 10 restarts");
});

child.start();

// process.once("SIGINT", () => {
//   bot.stop("SIGINT");
// });

// process.once("SIGTERM", () => {
//   bot.stop("SIGTERM");
// });
