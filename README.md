# NextRound

NextRound is a full-stack esports tournament management platform built to simplify tournament organization, player registration, match progression, results, rankings, and notifications.

> Every match leads to the next round.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Project Structure](#project-structure)
- [Roles](#roles)
- [Tournament Workflow](#tournament-workflow)
- [Authentication](#authentication)
- [API Overview](#api-overview)
- [Database](#database)
- [Frontend Pages](#frontend-pages)
- [Docker](#docker)
- [Local Development](#local-development)
- [Testing the Tournament Flow](#testing-the-tournament-flow)
- [Environment Variables](#environment-variables)
- [Development Workflow](#development-workflow)
- [Future Improvements](#future-improvements)
- [License](#license)

## Overview

NextRound provides two main experiences.

### Players / Normal Users

A normal user can:

- Create tournaments
- Browse tournaments
- Register for tournaments
- Follow tournament brackets
- View matches and results
- View rankings
- Receive notifications
- Manage personal tournament activity from the dashboard

### Administrators

An administrator can:

- Manage games
- Manage users
- Change user roles
- Delete users
- Access the administration dashboard

## Features

### Tournament Management

- Create tournaments
- Configure title, game, description, dates, maximum players, status, and prize
- View tournament details
- Update or delete tournaments according to permissions
- Start a tournament once the required number of players has been approved

### Player Registration

- Register for an open tournament
- Cancel a registration
- Organizers can approve or reject registration requests
- Tournament capacity is enforced through the approved-player limit
- Duplicate registration is prevented by a database constraint

### Automatic Tournament Brackets

When a tournament starts:

1. Approved players are collected
2. First-round players are randomized
3. Matches are generated automatically
4. The tournament moves to `in_progress`
5. Results determine the players who continue to the next round
6. New rounds are generated automatically
7. The tournament finishes after the final match

For example, with 4 approved players:

```text
Semi-final 1
Player A ─────┐
              ├── Winner ──┐
Player B ─────┘            │
                           ├── Champion
Semi-final 2                │
Player C ─────┐            │
              ├── Winner ──┘
Player D ─────┘
```

### Match Results

Organizers can enter results for their tournament matches.

A result contains:

- Match
- Player 1 score
- Player 2 score
- Winner

The backend validates that:

- Scores are valid
- A winner belongs to the match
- The match cannot end in a draw
- The winner has the higher score
- A result cannot be created twice for the same match

### Rankings

Player rankings are tracked per game.

Each ranking includes:

- Player
- Game
- Points
- Victories
- Defeats
- Position

### Notifications

The platform supports notifications for events such as registration updates, scheduled matches, and other tournament-related actions.

Users can:

- View notifications
- Mark one notification as read
- Mark all notifications as read
- Delete notifications

### Authentication & Authorization

Authentication is implemented with Laravel Sanctum.

The application uses:

- Registration
- Login
- Logout
- Current-user endpoint
- Protected API routes
- Role-based access
- Protected React routes

## Tech Stack

### Backend

- PHP 8.4
- Laravel 13
- Laravel Sanctum
- MySQL
- Eloquent ORM
- REST API

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React

### Development & Deployment

- Docker
- Docker Compose
- Apache
- Nginx
- Git / GitHub
- Docker Hub

## Project Architecture

```text
                 ┌─────────────────────┐
                 │      Browser        │
                 │   React + Vite      │
                 └──────────┬──────────┘
                            │
                            │ HTTP / JSON
                            ▼
                 ┌─────────────────────┐
                 │   Nginx / Frontend  │
                 │      container      │
                 └──────────┬──────────┘
                            │
                            │ /api
                            ▼
                 ┌─────────────────────┐
                 │ Laravel Backend     │
                 │ PHP + Apache        │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │       MySQL         │
                 │      Database       │
                 └─────────────────────┘
```

The frontend communicates with the Laravel API through Axios.

## Project Structure

```text
NextRound/
│
├── NextRound-backend/
│   ├── app/
│   │   ├── Http/
│   │   ├── Models/
│   │   ├── Policies/
│   │   └── Services/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   │   └── api.php
│   ├── docker/
│   │   └── 000-default.conf
│   ├── Dockerfile
│   ├── composer.json
│   └── ...
│
├── NextRound-frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   └── ...
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── ...
│
├── docker-compose.yml
└── README.md
```

## Roles

NextRound intentionally keeps the role system simple.

### `normal_user`

A normal user can participate in tournaments and also create and organize tournaments.

There is no separate `player` or `organizer` role.

### `admin`

An administrator manages the platform itself.

Admins can manage users and games through the administration dashboard.

## Tournament Workflow

The tournament lifecycle is:

```text
Create Tournament
       ↓
Tournament is OPEN
       ↓
Players Register
       ↓
Organizer Approves Players
       ↓
Tournament Reaches max_players
       ↓
Organizer Starts Tournament
       ↓
First Round is Generated
       ↓
Results are Entered
       ↓
Next Round is Generated
       ↓
More Results
       ↓
Final
       ↓
Tournament FINISHED
```

### Important capacity rule

`max_players` represents the maximum number of approved players.

For example:

```text
max_players = 4
```

The organizer can approve four players. A fifth approval is rejected because the tournament is already full.

The tournament cannot start until the number of approved players reaches the configured capacity.

## Authentication

The API uses Laravel Sanctum with bearer tokens.

### Register

```http
POST /api/register
```

### Login

```http
POST /api/login
```

### Current User

```http
GET /api/me
Authorization: Bearer <token>
```

### Logout

```http
POST /api/logout
Authorization: Bearer <token>
```

The React application stores the authentication token and Axios automatically sends it with protected requests.

## API Overview

### Authentication

```text
POST   /api/register
POST   /api/login
GET    /api/me
POST   /api/logout
```

### Games

```text
GET    /api/games
GET    /api/games/{game}
POST   /api/games
PUT    /api/games/{game}
DELETE /api/games/{game}
```

Game creation, update, and deletion are restricted to administrators.

### Tournaments

```text
GET    /api/tournaments
GET    /api/tournaments/{tournament}
POST   /api/tournaments
PUT    /api/tournaments/{tournament}
DELETE /api/tournaments/{tournament}
POST   /api/tournaments/{tournament}/start
```

### Registrations

```text
POST   /api/tournaments/{tournament}/register
DELETE /api/tournaments/{tournament}/register
GET    /api/tournaments/{tournament}/registrations
PUT    /api/registrations/{registration}
```

### Matches

```text
GET    /api/matches
GET    /api/matches/{match}
POST   /api/matches
PUT    /api/matches/{match}
DELETE /api/matches/{match}
```

### Results

```text
GET    /api/results
GET    /api/results/{result}
POST   /api/results
PUT    /api/results/{result}
DELETE /api/results/{result}
```

### Rankings

```text
GET /api/games/{game}/rankings
GET /api/games/{game}/rankings/{user}
GET /api/top-players
```

### Notifications

```text
GET    /api/notifications
GET    /api/notifications/{notification}
PUT    /api/notifications/{notification}/read
PUT    /api/notifications/read-all
DELETE /api/notifications/{notification}
```

### User Dashboard Data

```text
GET /api/my-tournaments
GET /api/my-registrations
GET /api/my-matches
GET /api/my-results
```

### Admin Users

```text
GET    /api/admin/users
PUT    /api/admin/users/{user}
DELETE /api/admin/users/{user}
```

## Database

The main entities are:

```text
User
 ├── Tournaments
 ├── Registrations
 ├── Matches
 ├── Results
 ├── Rankings
 └── Notifications

Game
 ├── Tournaments
 └── Rankings

Tournament
 ├── Game
 ├── Organizer (User)
 ├── Registrations
 └── Matches

Registration
 ├── Tournament
 └── User

TournamentMatch
 ├── Tournament
 ├── First Player
 ├── Second Player
 └── Result

Result
 ├── Match
 └── Winner

Ranking
 ├── User
 └── Game

Notification
 └── User
```

### Main tables

```text
users
 games
tournaments
registrations
matches
results
rankings
notifications
```

## Frontend Pages

The main public pages are:

```text
/
├── Home
├── About
├── Tournaments
├── Tournament Details
├── Games
├── Rankings
├── Login
└── Register
```

Authenticated users also have:

```text
/dashboard
```

Administrators have:

```text
/admin/dashboard
```

The application uses React Router to handle navigation and protected routes.

## Docker

The project includes Docker support for the complete application.

### Docker services

```text
frontend
backend
db
```

### Build and start the application

From the project root:

```bash
docker compose up -d --build
```

### Check containers

```bash
docker compose ps
```

### View logs

```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db
```

### Run Laravel commands inside the container

```bash
docker compose exec backend php artisan migrate
```

For a fresh database with seed data:

```bash
docker compose exec backend php artisan migrate:fresh --seed
```

Open a Laravel Tinker shell:

```bash
docker compose exec backend php artisan tinker
```

### Default local URLs

Frontend:

```text
http://localhost:3000
```

Backend:

```text
http://localhost:8000
```

MySQL is exposed to the host through the Docker Compose database port configured in the project.

## Local Development

### Backend

```bash
cd NextRound-backend
composer install
```

Create the environment file:

```bash
cp .env.example .env
```

Generate the Laravel application key:

```bash
php artisan key:generate
```

Configure the database in `.env`, then run:

```bash
php artisan migrate
php artisan db:seed
php artisan serve
```

### Frontend

```bash
cd NextRound-frontend
npm install
```

Configure the API URL in `.env`:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Start Vite:

```bash
npm run dev
```

## Testing the Tournament Flow

A simple end-to-end test uses a tournament with 4 players.

### Step 1 — Create a tournament

Set:

```text
Maximum players: 4
Status: open
```

### Step 2 — Register players

Register 4 users.

### Step 3 — Approve registrations

Approve all 4 registration requests.

The tournament should now show:

```text
4 / 4 approved
```

### Step 4 — Start the tournament

The organizer uses:

```http
POST /api/tournaments/{tournament}/start
```

The backend:

- validates the tournament status
- verifies the number of approved players
- randomizes the first-round players
- creates the matches
- changes the tournament status to `in_progress`

### Step 5 — Enter results

For every completed match, the organizer submits data such as:

```json
{
  "match_id": 1,
  "score_player1": 2,
  "score_player2": 1,
  "winner_id": 5
}
```

### Step 6 — Continue the tournament

Winning players are used to generate the next round.

With 4 players:

```text
2 Semi-finals
     ↓
1 Final
     ↓
1 Winner
```

## Environment Variables

### Backend

Typical values include:

```env
APP_NAME=NextRound
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=next_round
DB_USERNAME=
DB_PASSWORD=
```

When running the backend inside Docker, the database host should point to the Compose service:

```env
DB_HOST=db
DB_PORT=3306
```

### Frontend

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

For the Docker frontend setup, the API is proxied through Nginx and can use:

```env
VITE_API_URL=/api
```

## Development Workflow

Create a feature branch:

```bash
git checkout -b feature/feature-name
```

After making and testing changes:

```bash
git add .
git commit -m "Describe the change"
git push origin feature/feature-name
```

## Future Improvements

Possible future extensions include:

- Tournament search and advanced filtering
- Match scheduling and time management
- Player profiles
- More detailed statistics
- Live match updates
- Real-time notifications
- Tournament history
- Advanced ranking algorithms
- Game-specific tournament formats
- Double-elimination brackets
- Single-elimination configuration
- Round-robin tournaments
- Administration analytics

## License

This project is currently developed as an educational and portfolio project.

A specific open-source license can be added later depending on how the project is distributed.
