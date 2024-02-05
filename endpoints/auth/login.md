# Routes

## POST /auth/login

Login user.

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
  "password": "Adham#123"
}
```

### Response

If the request is success, the server will respond with a status code of 201 and a JSON of user:

```json
{
  "status": 201,
  "message": "We have sent you an OTP for verification",
  "data": {
    "email": "adhamhaddad.dev@gmail.com",
    "otp": "5759"
  },
  "total": 0,
  "meta": {}
}
```

### [Back to README](/api-endponits.md#user-auth)
