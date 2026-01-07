# Backend API

Python FastAPI backend for the Address Picker application.

## Features

- RESTful API endpoints for countries, regions, and cities
- Mock data for demonstration
- CORS enabled for frontend integration
- Simulated network delays (1 second per request) to demonstrate caching benefits

## API Endpoints

- `GET /` - API info
- `GET /api/countries` - Get all countries
- `GET /api/regions/{country_id}` - Get regions for a country
- `GET /api/cities/{region_id}` - Get cities for a region

## Setup

### Prerequisites

- Python 3.11+
- pip

### Installation

Install dependencies:

```bash
pip install -r requirements.txt
```

### Running the Server

Run with Python:

```bash
python main.py
```

Or with uvicorn directly:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at http://localhost:8000

API documentation is available at http://localhost:8000/docs

## Docker

Build and run with Docker:

```bash
docker build -t address-picker-backend .
docker run -p 8000:8000 address-picker-backend
```
