# Routes

## POST /auth/password-reset/verify

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
  "otp": "8093"
}
```

### Response

If the request is success, the server will respond with a status code of 201 and a JSON of user:

```json
{
  "status": 201,
  "message": "",
  "data": {
    "isValid": true
  },
  "total": 0,
  "meta": {}
}
```

### [Back to README](/api-endponits.md#user-auth)
