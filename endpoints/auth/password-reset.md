# Routes

## POST /auth/password-reset

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
  "username": "adhamhaddad.dev@gmail.com"
}
```

### Response

If the request is success, the server will respond with a status code of 201 and a JSON of user:

```json
{
  "status": 201,
  "message": "We have sent you an OTP for verification",
  "data": {
    "otp": "8093"
  },
  "total": 0,
  "meta": {}
}
```

### [Back to README](/api-endponits.md#user-auth)
