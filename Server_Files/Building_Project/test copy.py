import os
import pyodbc

from dotenv import load_dotenv
from pathlib import Path


project_root = Path(__file__).resolve().parents[2]
env_path = project_root / ".env"

load_dotenv(env_path)

server = os.getenv("DB_SERVER")
database = os.getenv("DB_NAME")
username = os.getenv("DB_USER")
password = os.getenv("DB_PASSWORD")
driver = os.getenv("DB_DRIVER")


connection_string = (
    f"DRIVER={{{driver}}};"
    f"SERVER={server};"
    f"DATABASE={database};"
    f"UID={username};"
    f"PWD={password};"
    "Encrypt=yes;"
    "TrustServerCertificate=yes;"
)


try:
    connection = pyodbc.connect(connection_string)

    print("Connection opened successfully.")

    cursor = connection.cursor()

    cursor.execute("SELECT 1")

    row = cursor.fetchone()

    print("Query returned:", row[0])

    cursor.execute("SELECT SUSER_SNAME()")
    login = cursor.fetchone()

    print("Logged in as:", login[0])

    cursor.close()
    connection.close()

    print("Connection test PASSED.")

except Exception as error:
    print("Connection FAILED.")
    print(type(error).__name__)
    print(error)