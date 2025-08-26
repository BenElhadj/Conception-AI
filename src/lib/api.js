import { PUBLIC_OPENAI_API_KEY } from '$env/static/public';

const API_KEY = PUBLIC_OPENAI_API_KEY;
const API_URL = "https://api.openai.com/v1/chat/completions";

export async function generateCode(prompt) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Tu es un assistant qui génère du code Svelte minimal et fonctionnel." },
        { role: "user", content: prompt }
      ]
    })
  });

  const data = await response.json();

  // On récupère le contenu textuel
  return data.choices?.[0]?.message?.content || "Erreur : aucune réponse.";
}
