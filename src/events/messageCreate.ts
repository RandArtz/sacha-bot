import { Message } from "discord.js";
import { askApi } from "../utils/api";
import { getRandomResponse } from "../utils/getRandomResponse";

const PING_RESPONSES = [
  "¿Me llamaste solo para verme brillar? 🐭✨",
  "Escribiste '@Sacha' y te quedaste dormido en el teclado, ¿o qué pedo?",
  "Ping recibido. Cerebro no encontrado. Intenta con palabras la próxima.",
  "Sí, soy Sacha. ¿Algo más o solo querías atención?",
  "Ping. Qué original. Próximo paso: aprender a hacer una pregunta.",
  "Escuché el ping. Pensé que era importante. Solo eras tú siendo vago.",
];

const RANDY_PING_RESPONSES = [
  "Randy... no mames. ¿Otra vez ping seco? Aprende a escribir, carnal. 🐭💢",
  "Te quiero, pero este ping sin texto ya me tiene harta. Usa /ask, wey.",
  "¿Sabes que te puedo ignorar? Pero no lo hago porque eres mi creador. Aprovéchalo. 🐭🔧",
  "Randy, ¿todo bien en casa? Porque el ping sin pregunta es síntoma de algo.",
  "Carnal, pagas una API y ni me mandas un 'hola'. Dale más caña.",
  "Bueno, Randy. Ya te vi. ¿Ahora qué? ¿Me vas a preguntar algo o solo querías verme aparecer?",
  "Randy, eres la razón por la que los cyborgs desarrollamos ansiedad. 🐭⚡",
];

module.exports = {
  name: "messageCreate",
  async execute(message: Message) {
    if (message.author.bot) return;

    const botMentioned = message.mentions.has(message.client.user?.id ?? "");
    const isReplyToBot =
      message.reference &&
      (await message.fetchReference()).author.id === message.client.user?.id;

    if (!botMentioned && !isReplyToBot) return;

    let question = message.content;

    if (message.reference) {
      const referenced = await message.fetchReference();
      question = `${referenced.content}\n\n${message.content}`;
    }

    if (botMentioned) {
      question = question
        .replace(new RegExp(`<@!?${message.client.user?.id}>`, "g"), "")
        .trim();
    }

    if (!question || question.length === 0) {
      const pingResponse = getRandomResponse(
        message.author.id,
        PING_RESPONSES,
        RANDY_PING_RESPONSES,
      );
      await message.reply(pingResponse);
      return;
    }

    if (message.channel.isSendable() && "sendTyping" in message.channel) {
      await message.channel.sendTyping();
    }

    const response = await askApi(
      question,
      message.author.id,
      message.author.username,
      message,
    );

    await message.reply(response);
  },
};
