# Delivery Address Picker

Address picker component for an international online marketplace. Implements cascading country/region/city selection with Redis caching to minimize backend requests.

## Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Python, FastAPI
- **Cache**: Redis


## Running the Application

Requires Docker: https://www.docker.com/get-started/

```bash
sudo docker compose up
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Redis: http://localhost:6379

First startup builds containers and prerenders the homepage with all countries and regions.

## Project Structure

```
├── backend/          # Python FastAPI backend
├── frontend/         # Next.js frontend
│   ├── app/         # App router pages and API routes
│   └── src/         # Components, hooks, utilities
└── docker-compose.yml
```

## Caching Implementation

Generic caching mechanism in `frontend/src/lib/redis.ts`:
- Stores data with timestamps in Redis
- Hard TTL (3 weeks default)
- Soft invalidation based on age
- Background revalidation support
