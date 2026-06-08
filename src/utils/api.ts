import axios from "axios";
import fs from "fs";
import path from "path";
import { Message } from "discord.js";
import { isRandy } from "./randy";

const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;
const API_MODEL = process.env.MODEL || "deepseek-chat";

const DEFAULT_PROMPT = fs.readFileSync(
  path.join(__dirname, "prompts", "default.txt"),
  "utf-8",
);

const RANDY_PROMPT = fs.readFileSync(
  path.join(__dirname, "prompts", "randy.txt"),
  "utf-8",
);

function getPrompt(userId: string): string {
  return isRandy(userId) ? RANDY_PROMPT : DEFAULT_PROMPT;
}

async function getServerContext(message?: Message): Promise<string> {
  if (!message || !message.guild) return "";

  try {
    const guild = message.guild;
    const memberCount = guild.memberCount;
    const guildName = guild.name;
    const channelName =
      ("name" in message.channel && message.channel.name) || "desconocido";

    const recentMessages = await message.channel.messages.fetch({ limit: 5 });
    const lastMessages = recentMessages
      .filter((msg) => !msg.author.bot)
      .map((msg) => `${msg.author.username}: ${msg.content.slice(0, 100)}`)
      .join("\n");

    return `
INFORMACIÓN DEL SERVIDOR:
- Nombre: ${guildName}
- Miembros: ${memberCount}
- Canal actual: #${channelName}

MENSAJES RECIENTES (sin bots):
${lastMessages || "No hay mensajes recientes"}

TU NOMBRE EN DISCORD: ${message.author.username}
`;
  } catch (error) {
    console.error("Error obteniendo contexto:", error);
    return "";
  }
}

export async function askApi(
  question: string,
  userId: string,
  username: string,
  message?: Message,
): Promise<string> {
  if (!API_URL || !API_KEY) {
    return "❌ Nel, papu. La API no está configurada. 🐭";
  }

  const prompt = getPrompt(userId);
  const serverContext = await getServerContext(message);

  const fullPrompt = serverContext ? `${prompt}\n\n${serverContext}` : prompt;

  try {
    const { data } = await axios.post(
      API_URL,
      {
        model: API_MODEL,
        messages: [
          { role: "system", content: fullPrompt },
          { role: "user", content: question },
        ],
        temperature: 0.8,
        max_tokens: 600,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    let reply = data.choices[0].message.content;
    if (reply.length > 1900) {
      reply = reply.slice(0, 1850) + "\n\n*(me cortaron la señal)*";
    }
    return reply;
  } catch (error) {
    console.error("API error:", error);
    return "❌ La rata se electrocutó. Intenta de nuevo.";
  }
}
