import os
import requests
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).parent / "D:\other-files\school\database_dev\Windigo Internship\HUBSPOT_KEY.env")

print("Working directory:", os.getcwd())
print("Token exists:", os.getenv("HUBSPOT_SERVICE_KEY") is not None)
print("Token value:", os.getenv("HUBSPOT_SERVICE_KEY"))

service_key = os.getenv("HUBSPOT_SERVICE_KEY")

headers = {
    "Authorization": f"Bearer {service_key}"
}

r = requests.get(
    "https://api.hubapi.com/crm/objects/2026-03/contacts",
    headers=headers
)

print(r.status_code)
print(r.text)