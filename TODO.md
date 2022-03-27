# Features to implement

# Request

## Methods

1. req.get('Content-Type') [DONE]
   // 'text/plain'
2. req.accepts('html') [DONE]
   // checks if Accept header from request contains specified field
3. req.is('html') [DONE]
   //same as abov, but for content-type
4.

## Properties

1. req.ip [DONE]
2. req.protocol [DONE]
   // returns 'http' or 'https' e.t.c
3. req.secure [DONE]
   // returns req.protocol === 'https'

# Response

## Methods

1. res.append('Content-Type', 'application/json')
   // appends value to header. creates it if it does not exist
2. res.get('Content-Type')
   // gets http response headers
3. res.location('http://foo.bar')
   // Sets the response Location HTTP header
4. res.redirect(status, path)
   // redirection
5. res.set(object or key/value pair)
   // sets the response’s HTTP header field to value.
6.
