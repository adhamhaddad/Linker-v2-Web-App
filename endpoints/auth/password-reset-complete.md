# Routes

## POST /auth/password-reset/reset

Password reset.

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
  "password": "Adham#123",
  "confirmPassword": "Adham#123",
  "otp": "8093"
}
```

### Response

If the request is success, the server will respond with a status code of 201 and a JSON of user:

```json
{
  "status": 201,
  "message": "Request successful",
  "data": {
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
  "total": 0,
  "meta": {}
}
```

### [Back to README](/api-endponits.md#user-auth)
