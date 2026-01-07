# Backend API

Python FastAPI backend for the FD Address Picker API.

## Features

- Mock-data RESTful API endpoints for countries, regions, and cities
- Simulated massive network delays (5-10 seconds per request) to demonstrate caching benefits

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
