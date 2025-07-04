// export const translateWithDeepL = async (text: string, targetLang: string) => {
//   const response = await fetch("https://api-free.deepl.com/v2/translate", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//     body: `auth_key=${encodeURIComponent("TA_CLE_API_ICI")}&text=${encodeURIComponent(text)}&target_lang=${targetLang.toUpperCase()}`,
//   });
//   const data = await response.json();
//   return data.translations?.[0]?.text || null;
// };
