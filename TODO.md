# TODO - Project Tasks

## Completed:
- [x] Remove unnecessary files: duplicates and unused configs
- [x] Update backend to use PostgreSQL instead of SQLite
- [x] Add psycopg2-binary and sqlalchemy to requirements.txt
- [x] Update main.py with SQLAlchemy models for PostgreSQL
- [x] Update render.yaml with PostgreSQL service

## Backend Deployment (PostgreSQL):
1. Go to https://dashboard.render.com
2. Click "New +" → "Blueprint"
3. Select repository: blackboy404-RGB/smm
4. Select branch: blackboxai/fix-backend-requirements
5. Render will detect backend/render.yaml and create:
   - socialflow-backend (web service)
   - socialflow-db (PostgreSQL database)
6. Click "Apply" to deploy

## Environment Variables:
After deployment, Render will provide:
- DATABASE_URL (auto-set for PostgreSQL)
- SECRET_KEY (auto-generated)

## Frontend:
Update frontend/src/lib/api.ts to point to your deployed backend URL after deployment.
