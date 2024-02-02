# AssayPlate API

The API server is reachable at `https://assay-plate-server.fly.dev/` **through HTTP requests with a JSON body**. The server address may change after 2/29/2024.

# Auth Cookie

API that has `*` in the title expects an auth cookie in the request (obtained from login/signup API).

If the server receives an invalid auth cookie when it expects one, it sends back this JSON body:

```json
{
  "unauthorized": true
}
```

# Authorization API

## `POST` /signup

purpose: register new user account with username and password. Response includes an auth cookie.

request body:
```json
{
  "username": "",
  "password": ""
}
```

response body (success):
```json
{ 
  "message": "",
  "success": true
}
```

response body (failure):
```json
{
  "message": "",
}
```

## `POST` /login

purpose: log in with username and password. Response includes an auth cookie.

request body:
```json
{
  "username": "",
  "password": ""
}
```

response body (success):
```json
{
  "message": "",
  "success": true
}
```

response body (failure):
```json
{
  "message": "",
}
```

## `POST` /logout

purpose: log out. Does not expect a request body. Response contains an expired cookie, prompting browsers to remove the auth cookie.

## * `GET` /

purpose: check if auth token is valid. Does not expect a request body.

response body:
```json
{
  "username": ""
}
```

## * `DELETE` /

purpose: delete user account. Does not expect a request body. Response contains an expired cookie, prompting browsers to remove the auth cookie.

# Plates API

See [Plate Schema](./Models/PlateModel.js). Notable rules for valid data:

1. length of `wells` must equal the product of `nRow` and `nCol`
2. reagent must be a number prefixed with an "R" (e.g., "R123")
3. concentration must be 0 without antibody
4. concentration must be non-negative with antibody present

## * `GET` /plates

purpose: get all plates the user has, along with username (for frontend's convenience). Does not expect a request body.

response body:
```json
{
  "plates": [],
  "username": ""
}
```

## * `POST` /plates/create

purpose: create new plates on the cloud. `"output"` is an array with an object for each plate in the request.

request body:
```json
{
  "plates": []
}
```

response body:
```json
{
  "output": []
}
```

`"output"` element (success):
```json
{
  "isCreated": true,
  "newPlate": {}
}
```

`"output"` element (failure):
```json
{
  "isCreated": false,
  "reason": ""
}
```

## * `POST` /plates/read

purpose: read specified plates from the cloud. Expects an array of MongoDB `_id` strings. `"output"` is an array with an object for each plate in the request.

request body:
```json
{
  "IDs": []
}
```

response body:
```json
{
  "output": []
}
```

`"output"` element (success):
```json
{
  "plate": {}
}
```

`"output"` element (failure):
```json
{
  "_id": "",
  "reason": ""
}
```

## * `POST` /plates/update

purpose: update specified plates on the cloud. `"failures"` is an array that contains an element for each *failed* plate update only.

request body:
```json
{
  "plates": []
}
```

response body:
```json
{
  "failures": []
}
```

`"failures"` element:
```json
{
  "_id": "",
  "reason": ""
}
```

## * `POST` /plates/delete

purpose: delete specified plates on the cloud. `"failures"` is an array that contains an element for each *failed* plate update only.

request body:
```json
{
  "IDs": []
}
```

response body:
```json
{
  "failures": []
}
```

`"failures"` element:
```json
{
  "_id": "",
  "reason": ""
}
```
