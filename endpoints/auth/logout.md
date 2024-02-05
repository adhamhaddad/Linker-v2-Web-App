# Routes

## POST /auth/logout

Logout user.

### Request Headers

The request headers should have the following properties:

```json
"headers": {
    "Content-Type": "application/json"
}
```

### Response

If the request is success, the server will respond with a status code of 200 and a JSON of user:

```json
{
  "status": 200,
  "message": "Logout Successfully",
  "data": null,
  "total": 0,
  "meta": {}
}
```

### [Back to README](/api-endponits.md#user-auth)
