





export async function yandexTranslate(text: string, targetLang: string): Promise<string> {
  const apiKey = "TON_IAM_TOKEN"; // remplace par ton IAM token Yandex Cloud

  const response = await fetch("https://translate.api.cloud.yandex.net/translate/v2/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      folderId: "b1gcijjok6q6ota3tj61", // obligatoire : récupère-le dans la console Yandex
      texts: [text],
      targetLanguageCode: targetLang,
    }),
  });

  const data = await response.json();
  return data.translations[0].text;
}
