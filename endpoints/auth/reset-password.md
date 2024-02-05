# Routes

## POST /auth/reset-password

Reset user password.

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
  "email": "ahmed@gmail.com",
  "password": "secret-password"
}
```

### Response

If the request is success, the server will respond with a status code of 201 and a JSON of user:

```json
{
  "message": "Password reset successfully."
}
```

### [Back to README](/api-endponits.md#user-auth)
