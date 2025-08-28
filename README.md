# Conception AI - Svelte Page Generator

Ce projet est une **application front-end client-only** développée en **SvelteKit**, qui permet de générer dynamiquement des pages Svelte à partir de prompts en langage naturel.
Cette application est conçue pour être utilisée uniquement côté client, sans backend.  
Elle utilise l'API OpenAI fournie par l'utilisateur et propose :  
- Génération de code depuis un prompt texte  
- Itération conversationnelle (raffinage du résultat)  
- Fonction **Undo** (annuler la dernière génération)  
- Affichage côte à côte : **Prompt / Code généré / Aperçu rendu**  
- Historique de conversation  
- Stockage local de la clé API  

---

## Fonctionnalités

- **Prompt utilisateur** → génère automatiquement du code Svelte minimal.  
- **Conversation** : chaque nouveau prompt affine le résultat (le contexte est conservé).  
- **Undo** : revenir à la version précédente du code et de l'historique.  
- **Affichage du code** et du **rendu visuel** généré.  
- **Modal de gestion de clé API** (saisie / modification, stockée en `localStorage`).  
- **Layout switch horizontal/vertical** pour adapter l'affichage.  
- **Responsive** : interface adaptée aux petits écrans.  

---

## Installation & Prérequis

### 1. Prérequis
- [Node.js](https://nodejs.org/) v16 ou plus  
- Une **clé API OpenAI** (à créer sur votre [compte OpenAI](https://platform.openai.com/account/api-keys) ou (https://platform.openai.com/settings/profile/api-keys))  

### 2. Installation
- Clonez le dépôt et installez les dépendances :

- git clone [<https://github.com/BenElhadj/Conception-AI.git>]
- cd conception-ai
- npm install

### 3. Lancement en local
   **pour lancer**
- npm run dev
   **pour lancer et tester le build**
- npm run build && npm run preview

## Configuration de la clé API

- **Lors du premier lancement :**

- Cliquez sur “Add API Key” dans le header.

- Collez votre clé OpenAI (format sk-...).

**Elle sera sauvegardée dans localStorage et utilisée pour les requêtes.**

**Vous pouvez la modifier à tout moment avec “Change API Key”.**

**⚠️ La clé n'est jamais stockée côté serveur ni exposée dans le code source.**

##  Utilisation

1. Tapez un prompt dans la zone Prompt.
    Exemple : “Crée une page avec un titre bleu et un bouton qui affiche une alerte”.

2. Cliquez sur Generate / Iterate.

    **Le code est généré et affiché dans la section Generated Code.**

    **Le rendu visuel apparaît dans la section Preview.**

3. Pour raffiner : tapez un nouveau prompt (“Rends le bouton rouge et ajoute un paragraphe”).
→ Le contexte est conservé grâce à l'historique conversationnel.

4. Pour annuler la dernière génération, cliquez sur Undo.

5. L'historique complet de la conversation est affiché en bas de page.

##  Structure du projet
src/
├─ lib/
│   ├─ assets/ .................................... # Ressources statiques (icônes, images éventuelles)
│   ├─ components/ ................................ # Composants UI
│   │   ├─ ApiModal.svelte ........................ # Modal pour saisir/éditer la clé API
│   │   ├─ CodePanel.svelte ....................... # Affiche le code généré + bouton de téléchargement
│   │   ├─ Controls.svelte ........................ # Boutons de génération / undo
│   │   ├─ ConversationHistory.svelte ............. # Liste des prompts + réponses (chat history)
│   │   ├─ Header.svelte .......................... # Header principal (API Key + Layout toggle)
│   │   ├─ PreviewPanel.svelte .................... # Affiche le rendu live du code généré dans un iframe
│   │   └─ PromptPanel.svelte ..................... # Zone de texte pour écrire un prompt
│   │
│   ├─ history/ ................................... # Gestion de l'historique et du state persistant
│   │   ├─ chat.js ................................ # Stores Svelte : conversation, stack undo, code généré, layout
│   │   └─ persisted.js ........................... # Helper pour persister un store Svelte dans localStorage
│   │
│   ├─ styles/
│   │   └─ app.css ................................ # Styles globaux + responsive + modal
│   │
│   └─ api.js ..................................... # Gestion des appels API vers OpenAI (fetch)
│
└─ routes/
    └─ +page.svelte ............................... # Page principale intégrant tous les composants


- **api.js : gère les appels à l'API OpenAI et retourne le code généré.**

- **+page.svelte : UI principale (prompt, code, preview, undo, historique, modal API key).**

### Build & Déploiement
- Build production
- npm run build
- npm run preview

- **Déploiement (optionnel, bonus)**

- Pour générer un site statique :

- **Installer l'adapter :**

- npm install -D @sveltejs/adapter-static


- **Modifier svelte.config.js :**

- import adapter from '@sveltejs/adapter-static';

export default {
  kit: {
    adapter: adapter(),
    prerender: { default: true }
  }
};

- **Lancer :**

- npm run build

===> le projet est déjà déployé sur https://conception-ai.vercel.app/

### Limitations

- Pas de backend : toutes les requêtes passent par le navigateur.

- La clé API est stockée en localStorage et utilisée telle quelle.

- La sécurité n'est pas garantie pour un usage en production (exercice technique uniquement).

- Le rendu du code repose sur une injection HTML/JS simple ({@html} + new Function), donc limité en complexité.

