import { Configuration, OpenAIApi } from "openai";
import { createReadStream } from "fs";
import config from "config";
import { startSession } from "./utils.js";
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
    const maxAttempts = 5;
    let attempts = 0;
    while (attempts < maxAttempts) {
      try {
        const completion = await this.openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages,
        });
        return completion.data.choices[0].message;
      } catch (e) {
        attempts++;
        console.error(`Error (${e}).`);
        await new Promise((resolve) => setTimeout(resolve, 5000));
        console.error(`Attempts (${attempts}).`);
      }
    }
    return { content: "ErrorSessionNeedTrimMessege" };
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
