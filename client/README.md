# SkillTracker
Application web de gestion des compétences pour le Master 1 Informatique de l'Université de Poitiers. Ce projet utilise React, Vite, Express, et l'API Discord pour permettre aux étudiants d'améliorer leurs compétences.

# Auteurs
- Maxime MARCHIVE
- Ronan PLUTA-FONTAINE
- Victor FRICONNET

# Site internet disponible en ligne :
https://aaw.univportfolio.info

## Technologies utilisées

- **Frontend**: React + Vite
- **Backend**: Express.js
- **Authentification**: Discord OAuth2
- **Base de données**: Google Sheets API
- **Style**: CSS natif

## Prérequis

- Node.js (version 18 ou supérieure)
- npm (version 9 ou supérieure)
- Un compte Google Cloud avec l'API Google Sheets activée
- Une application Discord pour l'authentification

## Installation

1. Cloner le dépôt :
```bash
git clone <URL_DU_REPO>
cd <NOM_DU_PROJET>
```

2. Installer les dépendances :
```bash
npm install
npm install googleapis
npm install lucide-react
npm install express
npm install passport passport-discord
npm install express-session
npm install dotenv
```

## Configuration

### Fichier .env

Créer un fichier `.env` à la racine du projet avec les informations suivantes :

```env
# Google Sheets Configuration
VITE_SPREADSHEET_ID="votre_spreadsheet_id"
VITE_RANGE="nom_de_la_feuille"

# Discord OAuth2 Configuration
DISCORD_CLIENT_ID=votre_client_id
DISCORD_CLIENT_SECRET=votre_client_secret
DISCORD_CALLBACK_URL=http://localhost:5000/auth/discord/callback
SESSION_SECRET=une_chaine_aleatoire_securisee

# Administration
ADMIN_DISCORD_IDS=id1,id2,id3

# BD
MDP_SERVER=tm36XQ375Vuf8Vqje43Jb7JLsPZ4g
BASE_API_URL=http://localhost:3000
API_TOKEN=20618016798589713892511336934969888
SESSION_SECRET="ea78dc821fa403a0d80541b0bdde2a33d63196998b80a45402b655cedab07afba1904df1d5e2d22172155f5e86826a62062d5c4a3234f42891b88ee9aa0024c0"J
```
### Configuration Google Sheets

1. Créer un projet sur Google Cloud Console
2. Activer l'API Google Sheets
3. Créer un compte de service
4. Télécharger le fichier JSON des credentials
5. Partager votre Google Sheet avec l'email du compte de service

### Configuration Discord

1. Créer une application sur le [Discord Developer Portal](https://discord.com/developers/applications)
2. Configurer l'OAuth2
3. Ajouter l'URL de redirection (callback)
4. Récupérer le Client ID et le Client Secret

## Lancement du projet

### Mode développement

1. Construire le frontend :
```bash
npm run build
```

2. Lancer le serveur :
```bash
node server.js
```

Le serveur sera accessible sur http://localhost:5000

À chaque modification du code source :
```bash
npm run build
```

## Structure du projet

```
aaw_project_client/
├── src/
│   ├── components/
│   │   ├── AdminRoute/
│   │   ├── Header/
│   │   ├── Footer/
│   │   └── Template/
│   ├── pages/
│   │   ├── Home/
│   │   ├── Login/
│   │   ├── NotFound/
│   │   ├── SkillsPage/
│   │   ├── StudentProfile/
│   │   └── User/
│   ├── services/
│   │   └── apiGoogleSpreadSheet.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── public/
├── .env
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── README.md
├── server.js
├── spreadsheet.json
└── vite.config.js
```

## Fonctionnalités

- Authentification via Discord
- Tableau des compétences des étudiants
- Profils individuels des étudiants
- Modification des compétences (avec permissions)
- Interface d'administration
- Intégration avec Google Sheets

## Gestion des permissions

- **Administrateurs**: Peuvent modifier toutes les fiches sauf un autre admin
- **Étudiants**: Peuvent uniquement modifier leur propre fiche
- **Visiteurs**: Lecture seule

## Git Workflow

### Commandes essentielles

```bash
git status              # État des fichiers
git add .               # Ajouter les modifications
git commit -m "msg"     # Créer un commit
git push                # Pousser les changements
```

### Convention de nommage des commits

- `feat:` Nouvelle fonctionnalité
- `fix:` Correction de bug
- `docs:` Documentation
- `style:` Formatage du code
- `refactor:` Refactorisation
- `test:` Tests
- `chore:` Maintenance

Exemple: `git commit -m "feat: ajout système de permissions"`

## Ressources

- [Documentation Vite](https://vitejs.dev/)
- [Documentation React](https://react.dev/)
- [API Discord](https://discord.com/developers/docs/)
- [Google Sheets API](https://developers.google.com/sheets/api/)