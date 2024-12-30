## Deploy

1. Copy `.env.prod` to `.env` and edit it
2. Run `docker-compose up -d`

## Development

### Run database
1. Run `docker-compose -f docker-compose.dev.yaml up`

### Run backend
1. Go to `backend` folder
2. Run `npx prisma generate` as needed
3. Run `npx prisma migrate dev` or `npx prisma migrate deploy` as needed
4. Run `npm run start:dev`

### Run frontend
1. Go to `frontend` folder
2. Run `npm run dev`

## TODO

- Email verification
- Password reset
