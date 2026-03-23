# NSW Progressions Math Game

This is a Vite + React version of the NSW Progressions Math Game built from the latest canvas app.

## Requirements

- Node.js 20.19+ or 22+

## Install

```bash
npm install
```

If your machine has a private npm registry configured and install fails, run:

```bash
npm install --registry=https://registry.npmjs.org/
```

## Run locally

```bash
npm run dev
```

Then open the local URL shown in the terminal.

## Build for production

```bash
npm run build
npm run preview
```

## Deploy

### Vercel

1. Push this folder to GitHub.
2. Import the repo into Vercel.
3. Accept the detected Vite settings.
4. Deploy.

### Netlify

1. Push this folder to GitHub.
2. Import the repo into Netlify.
3. Build command: `npm run build`
4. Publish directory: `dist`

## Notes

- Student progress is stored in local browser storage unless they use the built-in save password transfer feature.
- Save passwords are designed for moving progress between computers, not for secure accounts.
- The project uses local UI components in `src/components/ui` so it does not depend on the ChatGPT canvas environment.
