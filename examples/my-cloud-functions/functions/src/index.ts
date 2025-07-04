import * as functions from "firebase-functions/v2/https";
import { HttpsError } from "firebase-functions/v1/https";
import * as deepl from "deepl-node";
import fetch from "node-fetch";

const authKey = "07067667-4177-4d5f-8c39-2fb7ae435397:fx"; // Remplace par ta clé DeepL
const deeplClient = new deepl.DeepLClient(authKey);

export const translateText = functions.onCall(async (request) => {
  const { text, iso } = request.data;

  if (!text || !iso) {
    throw new HttpsError(
      "invalid-argument",
      "Les champs 'text' et 'iso' sont requis."
    );
  }

  try {
    const result = await deeplClient.translateText(text, null, iso) as deepl.TextResult;
    console.log("✅ Traduction:", result.text);
    return { result: result.text, iso };
  } catch (error) {
    console.error("❌ Erreur DeepL:", error);
    throw new HttpsError(
      "internal",
      "Erreur lors de la traduction."
    );
  }
});



export async function yandexTranslate(text: string, targetLang: string): Promise<string> {
  const apiKey = "TON_IAM_TOKEN"; // remplace par ton IAM token Yandex Cloud

  const response = await fetch("https://translate.api.cloud.yandex.net/translate/v2/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      folderId: "TON_FOLDER_ID", // obligatoire : récupère-le dans la console Yandex
      texts: [text],
      targetLanguageCode: targetLang,
    }),
  });

  const data = await response.json();
  return data.translations[0].text;
}
