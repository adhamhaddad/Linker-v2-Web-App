# Routes

## POST /users

Update user.

### Request Headers

The request headers should have the following properties:

```json
"headers": {
    "Content-Type": "application/json",
    "Authorization": "Bearer <token>"
}
```

### Request Body

The request body should be a JSON object with any of the following properties:

```json
{
  "firstName": "Adham",
  "middleName": "Ashraf",
  "lastName": "Haddad",
  "username": "adhamhaddad",
  "email": "adham@gmail.com"
}
```

### Response

If the request is success, the server will respond with a status code of 201 and a JSON of user:

```json
{
  "data": {
    "id": "0c6e070d-07b8-4c38-b9db-8822e63566be",
    "firstName": "Adham",
    "middleName": "Adham",
    "lastName": "Adham",
    "username": "adhamhaddad",
    "email": "ahmed@gmail.com",
    "createdAt": "TIMESTAMP",
    "updatedAt": "TIMESTAMP"
  }
}
```

### [Back to README](/api-endponits.md#user-management)
