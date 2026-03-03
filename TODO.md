# TODO - Remove Unnecessary Files

## ✅ Completed:
- [x] backend/main_fixed.py (removed)
- [x] backend/main_fixed2.py (removed)
- [x] nixpacks.toml (removed - duplicate at root)
- [x] render.yaml (removed - duplicate at root)
- [x] package.json (removed - duplicate at root)
- [x] fly.zip (removed)
- [x] railway.json (removed)

## Remaining (in .gitignore but optional to remove):
- [ ] .venv-1/ (likely already removed)
- [ ] socialflow.db (dev database)
- [ ] .next/ (build output - in frontend/)
- [ ] node_modules/ (dependencies - in frontend/)

## Project Structure After Cleanup:
```
smm-app/
├── .git/
├── .venv/
├── backend/
│   ├── .env
│   ├── .env.example
│   ├── main.py
│   ├── Procfile
│   ├── render.yaml
│   ├── requirements.txt
│   ├── runtime.txt
│   ├── socialflow.db
│   └── wsgi.py
├── frontend/
│   ├── .env.example
│   ├── .env.production
│   ├── .eslintrc.json
│   ├── netlify.toml
│   ├── next-env.d.ts
│   ├── next.config.js
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── vercel.json
│   ├── .next/
│   ├── node_modules/
│   └── src/
├── .gitignore
├── README.md
├── socialflow.db
├── SPEC.md
└── TODO.md
