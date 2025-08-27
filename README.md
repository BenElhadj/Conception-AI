# Conception AI – Svelte Page Generator

Ce projet est une **application front-end client-only** développée en **SvelteKit**, qui permet de générer dynamiquement des pages Svelte/HTML à partir de prompts en langage naturel.  
Elle utilise l’API OpenAI fournie par l’utilisateur et propose :  
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
- **Undo** : revenir à la version précédente du code et de l’historique.  
- **Affichage du code** et du **rendu visuel** généré.  
- **Modal de gestion de clé API** (saisie / modification, stockée en `localStorage`).  
- **Layout switch horizontal/vertical** pour adapter l’affichage.  
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

**⚠️ La clé n’est jamais stockée côté serveur ni exposée dans le code source.**

##  Utilisation

1. Tapez un prompt dans la zone Prompt.
    Exemple : “Crée une page avec un titre bleu et un bouton qui affiche une alerte”.

2. Cliquez sur Generate / Iterate.

    **Le code est généré et affiché dans la section Generated Code.**

    **Le rendu visuel apparaît dans la section Preview.**

3. Pour raffiner : tapez un nouveau prompt (“Rends le bouton rouge et ajoute un paragraphe”).
→ Le contexte est conservé grâce à l’historique conversationnel.

4. Pour annuler la dernière génération, cliquez sur Undo.

5. L’historique complet de la conversation est affiché en bas de page.

##  Structure du projet
src/
├─ lib/
│   ├─ api.js               # Appel à l’API OpenAI (fetch)
│   └─ assets/              # Icônes (layout toggle)
└─ routes/
    └─ +page.svelte         # Page principale avec l’interface UI


- **api.js : gère les appels à l’API OpenAI et retourne le code généré.**

- **+page.svelte : UI principale (prompt, code, preview, undo, historique, modal API key).**





### Build & Déploiement
- Build production
- npm run build
- npm run preview

- **Déploiement (optionnel, bonus)**

- Pour générer un site statique :

- **Installer l’adapter :**

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


→ Les fichiers statiques sont prêts dans le dossier build/.

Déployez sur Netlify
, Vercel
, ou GitHub Pages.





### Limitations

- Pas de backend : toutes les requêtes passent par le navigateur.

- La clé API est stockée en localStorage et utilisée telle quelle.

- La sécurité n’est pas garantie pour un usage en production (exercice technique uniquement).

- Le rendu du code repose sur une injection HTML/JS simple ({@html} + new Function), donc limité en complexité.



### Auteur

- **Projet réalisé par Hamdi BEN ELHADJ Candidat Frontend Developer – Conception AI**