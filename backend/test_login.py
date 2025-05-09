import requests

url = "http://127.0.0.1:5000/api/auth/login"
payload = {
    "email": "user@example.com",
    "password": "secure123"
}

response = requests.post(url, json=payload)

print("Status Code:", response.status_code)
print("Response:", response.json())

