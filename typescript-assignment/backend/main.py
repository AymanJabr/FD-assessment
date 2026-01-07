from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
import time
import random

class Country(BaseModel):
    id: str
    name: str

class Region(BaseModel):
    id: str
    name: str
    countryId: str

class City(BaseModel):
    id: str
    name: str
    regionId: str

class CountriesResponse(BaseModel):
    data: List[Country]

class RegionsResponse(BaseModel):
    data: List[Region]

class CitiesResponse(BaseModel):
    data: List[City]

app = FastAPI(title="FD Address Picker API", version="0.0.1")



# Mock data - simulating a legacy database
MOCK_DATA: Dict[str, any] = {
    "countries": [
        Country(id="nl", name="Netherlands"),
        Country(id="de", name="Germany"),
        Country(id="us", name="United States"),
        Country(id="fr", name="France"),
    ],
    "regions": {
        "nl": [
            Region(id="nh", name="North Holland", countryId="nl"),
            Region(id="zh", name="South Holland", countryId="nl"),
            Region(id="ut", name="Utrecht", countryId="nl"),
            Region(id="gl", name="Gelderland", countryId="nl"),
            Region(id="lb", name="Limburg", countryId="nl"),
        ],
        "de": [
            Region(id="bw", name="Baden-Württemberg", countryId="de"),
            Region(id="by", name="Bavaria", countryId="de"),
            Region(id="be", name="Berlin", countryId="de"),
        ],
        "us": [
            Region(id="ca", name="California", countryId="us"),
            Region(id="ny", name="New York", countryId="us"),
            Region(id="tx", name="Texas", countryId="us"),
        ],
        "fr": [
            Region(id="idf", name="Île-de-France", countryId="fr"),
            Region(id="ara", name="Auvergne-Rhône-Alpes", countryId="fr"),
            Region(id="occ", name="Occitanie", countryId="fr"),
        ],
    },
    "cities": {
        "gl": [
            City(id="arn", name="Arnhem", regionId="gl"),
            City(id="nij", name="Nijmegen", regionId="gl"),
        ],
        "lb": [
            City(id="maa", name="Maastricht", regionId="lb"),
            City(id="ven", name="Venlo", regionId="lb"),
        ],
        "ca": [
            City(id="la", name="Los Angeles", regionId="ca"),
            City(id="sf", name="San Francisco", regionId="ca"),
            City(id="sd", name="San Diego", regionId="ca"),
        ],
        "ny": [
            City(id="nyc", name="New York City", regionId="ny"),
            City(id="buf", name="Buffalo", regionId="ny"),
            City(id="roc", name="Rochester", regionId="ny"),
        ],
        "tx": [
            City(id="hou", name="Houston", regionId="tx"),
            City(id="dal", name="Dallas", regionId="tx"),
            City(id="aus", name="Austin", regionId="tx"),
        ],
        "bw": [
            City(id="stu", name="Stuttgart", regionId="bw"),
            City(id="man", name="Mannheim", regionId="bw"),
            City(id="fre", name="Freiburg", regionId="bw"),
        ],
        "by": [
            City(id="muc", name="Munich", regionId="by"),
            City(id="nur", name="Nuremberg", regionId="by"),
            City(id="aug", name="Augsburg", regionId="by"),
        ],
        "be": [
            City(id="ber", name="Berlin", regionId="be"),
        ],
        "nh": [
            City(id="ams", name="Amsterdam", regionId="nh"),
            City(id="haa", name="Haarlem", regionId="nh"),
        ],
        "zh": [
            City(id="rot", name="Rotterdam", regionId="zh"),
            City(id="hag", name="The Hague", regionId="zh"),
        ],
        "ut": [
            City(id="utr", name="Utrecht", regionId="ut"),
        ],
        "idf": [
            City(id="par", name="Paris", regionId="idf"),
            City(id="ver", name="Versailles", regionId="idf"),
        ],
        "ara": [
            City(id="lyo", name="Lyon", regionId="ara"),
            City(id="gre", name="Grenoble", regionId="ara"),
        ],
        "occ": [
            City(id="tou", name="Toulouse", regionId="occ"),
            City(id="mon", name="Montpellier", regionId="occ"),
        ],
    },
}


def simulate_legacy_delay():
    # Simulate slow legacy hardware with random delay between 5-10 seconds
    delay = random.uniform(5, 10)
    print(f"Delay of {delay:.2f} seconds...")
    time.sleep(delay)


@app.get("/")
def read_root():
    return {"message": "FD Address Picker API", "version": "0.0.1"}


@app.get("/api/countries", response_model=CountriesResponse)
def get_countries():
    print("Fetching countries from legacy backend...")
    simulate_legacy_delay()
    return {"data": MOCK_DATA["countries"]}


@app.get("/api/regions/{country_id}", response_model=RegionsResponse)
def get_regions(country_id: str):
    print(f"Fetching regions for country: {country_id} from legacy backend...")
    simulate_legacy_delay()

    if country_id not in MOCK_DATA["regions"]:
        raise HTTPException(status_code=404, detail="Country not found")

    return {"data": MOCK_DATA["regions"][country_id]}


@app.get("/api/cities/{region_id}", response_model=CitiesResponse)
def get_cities(region_id: str):
    print(f"Fetching cities for region: {region_id} from legacy backend...")
    simulate_legacy_delay()

    if region_id not in MOCK_DATA["cities"]:
        raise HTTPException(status_code=404, detail="Region not found")

    return {"data": MOCK_DATA["cities"][region_id]}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
