# fitness_tracker

## GitHub Pages (host the static site)

This repository contains a static front-end in the `public/` folder. To host the site with GitHub Pages we copy the site into the `docs/` folder and configure GitHub Pages to serve from `main` / `docs`.

Steps to publish:

- Commit the new `docs/` folder (created locally by the project helper).
- Push to your GitHub repository `main` branch.
- In the GitHub repository UI go to: `Settings` → `Pages` → `Build and deployment`.
	- Under `Source`, select `Branch: main` and `Folder: /docs` then click `Save`.
	- Wait a minute and your site will be available at `https://<your-username>.github.io/<repo-name>`.

Quick commands (from repository root):

```powershell
git add docs README.md
git commit -m "Add docs for GitHub Pages"
git push origin main
```

If you prefer automatic deployment via GitHub Actions (deploy to `gh-pages`), I can add a workflow for that — tell me if you want it.

Notes:
- We added `docs/.nojekyll` so GitHub Pages won't process files with Jekyll.
- The `app.js` is a Node server and won't be used by GitHub Pages — GitHub Pages serves static files only.

If you want, I can also create a GitHub Action to deploy `public/` automatically to `gh-pages` branch.
# fitness_tracker
