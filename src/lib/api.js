const API_URL = "https://api.openai.com/v1/chat/completions";

export async function generateCode(messages) {  // Change à messages pour supporter conversation
  const apiKey = localStorage.getItem('openai_api_key');
  if (!apiKey) {
    throw new Error("Clé API OpenAI manquante. Veuillez la fournir dans les paramètres.");
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",  // Change à un modèle plus récent/meilleur
      messages: [
                {
          role: "system",
          content:
          "Tu es un assistant expert qui génère du code svelte minimal utilisable directement dans une div. \
        Retourne uniquement un bloc avec <script>, <style> et du HTML, \
        sans <html>, <head> ni <body>, sans doctype, sans meta, sans title, sans markdown. \
        Pas d'import ni export."
        },
        ...messages  // Supporte historique conversationnel
      ],
      temperature: 0.7,  // Optionnel : pour plus de créativité contrôlée
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Erreur API: ${errorData.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "Erreur : aucune réponse valide.";
}