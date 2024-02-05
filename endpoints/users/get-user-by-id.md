# Routes

## GET /users/`id`

Get users by ID.

### Request Headers

The request headers should have the following properties:

```json
"headers": {
    "accept": "application/json",
    "Authorization": "Bearer <token>"
}
```

### Request Params

1. `id`=string - (`required`)

### Response

If the request is success, the server will respond with a status code of 200 and a JSON of user:

```json
{
  "data": {
    "id": "0c6e070d-07b8-4c38-b9db-8822e63566be",
    "firstName": "Adham",
    "lastName": "Haddad",
    "username": "adhamhaddad",
    "email": "ahmed@gmail.com",
    "createdAt": "TIMESTAMP",
    "updatedAt": "TIMESTAMP"
  }
}
```

### [Back to README](/api-endponits.md#user-management)
