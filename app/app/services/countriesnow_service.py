import httpx

BASE_URL = "https://countriesnow.space/api/v0.1"


async def fetch_countries():
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BASE_URL}/countries/positions")

        data = response.json()

        if not data["error"]:
            return data["data"]

        return []


async def fetch_states(country: str):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{BASE_URL}/countries/states",
            json={"country": country}
        )

        data = response.json()

        if not data["error"]:
            return data["data"]["states"]

        return []


async def fetch_cities(country: str, state: str):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{BASE_URL}/countries/state/cities",
            json={
                "country": country,
                "state": state
            }
        )

        data = response.json()

        if not data["error"]:
            return data["data"]

        return []
