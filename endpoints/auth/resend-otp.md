# Routes

## POST /auth/email/resend

Resend OTP.

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
  "source": "email"
}
```

### Response

If the request is success, the server will respond with a status code of 201 and a JSON of user:

```json
{
  "status": 201,
  "message": "We have sent you an OTP for verification",
  "data": {
    "otp": "2544"
  },
  "total": 0,
  "meta": {}
}
```

### [Back to README](/api-endponits.md#user-auth)
