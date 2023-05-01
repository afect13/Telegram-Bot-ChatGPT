import { unlink } from "fs/promises";

export async function removeFile(filepath) {
  try {
    await unlink(filepath);
  } catch (e) {
    console.log(`Error while unlinking file: `, e.message);
  }
}

export const gptMessage = (content, role = "user") => ({
  content,
  role,
});

export const startSession = () => ({
  messages: [],
});

export const trimSessionMessages = (messages) => {
  const excess = messages.length - 8;
  messages.splice(0, excess);
};

export const trimSessionMessagesAfterError = (messages) => {
  messages.splice(0, 2);
};
