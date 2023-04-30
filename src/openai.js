import { Configuration, OpenAIApi } from "openai";
import { createReadStream } from "fs";
import config from "config";
import { exec } from "child_process";
class OpenAI {
  roles = {
    ASSISTANT: "assistant",
    SYSTEM: "system",
    USER: "user",
  };

  constructor(apiKey) {
    const configuration = new Configuration({
      apiKey,
    });
    this.openai = new OpenAIApi(configuration);
  }
  async chat(messages = []) {
    try {
      const completion = await this.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages,
      });

      console.log("Usage", completion.data.usage);
      return completion.data.choices[0].message;
    } catch (e) {
      console.error(`Error while chat completion: ${e.message}`);
      exec("npm run restart");
      return { content: "Ошибка запроса к серверу, произвожу перезапуск систем. Повторите запрос через 3 секунды" };
    }
  }

  async transcription(filepath) {
    try {
      const response = await this.openai.createTranscription(createReadStream(filepath), "whisper-1");
      return response.data.text;
    } catch (e) {
      console.error(`Error while transcription: ${e.message}`);
    }
  }
}

export const openai = new OpenAI(config.get("OPENAI_API_KEY"));
