# Routes

## POST /auth/login/verify

Verify login.

### Request Headers

The request headers should have the following properties:

```json
"headers": {
    "Content-Type": "application/json"
}
```

### Request Body

The request body should be a JSON object with the following properties:

```json
{
  "username": "adhamhaddad.dev@gmail.com",
  "otp": "5759"
}
```

### Response

If the request is success, the server will respond with a status code of 201 and a JSON of user:

```json
{
  "status": 201,
  "message": "Login successfully!",
  "data": {
    "user": {
      "id": "00826ee3-7a2a-4065-a3aa-53aecc6a524a",
      "firstName": "Adham",
      "middleName": null,
      "lastName": "Haddad",
      "username": "adhamhaddad",
      "email": "adhamhaddad.dev@gmail.com",
      "gender": "male",
      "createdAt": "2024-01-16T02:00:44.204Z",
      "updatedAt": "2024-01-16T02:01:36.310Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo4LCJ1dWlkIjoiMDA4MjZlZTMtN2EyYS00MDY1LWEzYWEtNTNhZWNjNmE1MjRhIiwiZmlyc3RfbmFtZSI6IkFkaGFtIiwibWlkZGxlX25hbWUiOm51bGwsImxhc3RfbmFtZSI6IkhhZGRhZCIsInVzZXJuYW1lIjoiYWRoYW1oYWRkYWQiLCJnZW5kZXIiOiJtYWxlIiwiZW1haWwiOiJhZGhhbWhhZGRhZC5kZXZAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkUDJ3WGRoWlNwNTJlNFVOQWRqVkhYTzlMSGg3QXk2SWh2bUIyMVJLcUNrdGcxTlhuQ01qSWEiLCJzYWx0IjoiZjNjMzRjYjg1MTVmYjViYjVjYjRjMzk3ZjFmOWZjNGExMjEzODAwODM4NTQ3YTYzYzRjNTJiYTFkZjNmYTk2OGViY2EwOThkNTAyNDdjNWRiMDE5YjFhNjg4OTMyMzMzIiwiZW1haWxfdmVyaWZpZWRfYXQiOiIyMDI0LTAxLTE2VDAyOjAxOjM2LjI5OFoiLCJjcmVhdGVkX2F0IjoiMjAyNC0wMS0xNlQwMjowMDo0NC4yMDRaIiwidXBkYXRlZF9hdCI6IjIwMjQtMDEtMTZUMDI6MDE6MzYuMzEwWiIsImRlbGV0ZWRfYXQiOm51bGx9LCJpYXQiOjE3MDUzNzA2MzUsImV4cCI6MTcwNTYyOTgzNX0.YKtR5gNxhGXtdkJBU7WRkFbmQop-43OXYXmMFcYBTzQ"
  },
  "total": 0,
  "meta": {}
}
```

### [Back to README](/api-endponits.md#user-auth)
