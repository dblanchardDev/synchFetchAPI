# Fetch API for Synchronous ES6

Adds a basic version of fetch and its related objects to a synchronous ES6 only environment. Useful in an environment like ArcGIS Survey123, which does not include the Fetch API.

Not all features of the Fetch API can be replicated using a synchronous XMLHttpRequest. Major deviations from the standard are noted for each component.

Author: David Blanchard

License: [MIT License](LICENSE)

## Components

- [Fetch](#fetch-function): Fetch content from the web.
- [Request](#request-class): Set the URL and options for a fetch request.
- [Response](#response-class): Response returned by a fetch request.
- [Headers](#headers-class): Set of headers used for both requests and responses.
- [URL](#url-class): Construct and manipulate URLs.
- [URLSearchParams](#urlsearchparams-class): Construct and manipulate the search parameters component of a URL.

---

## How to Use

Simply copy the content of the _script.js_ file into the file you need access to the fetch API. For example, in ArcGIS Survey 123, copy into your JavaScript code in the _Scripts_ tab of ArcGIS Survey 123 Connect.

---

## Fetch Function

> 🔸 **Deviation from standards**
>
> - Operation is synchronous and will block until the HTTP request has completed.
> - Returns the response instead of a promise.
> - Limited number of options.
> - Limited format support for the request body.
> - Only supports text responses (no blobs). This is a limitations of synchronous XMLHttpRequest.

The fetch function starts the processes of fetching a resource from the network.

```js
fetch(resource)
fetch(resource, options)
```

### Parameters

#### `resource`

One of:

- URL of resource to fetch as a string.
- An instance of the [URL Class](#url-class).
- An instance of the [Request Class](#request-class).

#### `options`

An object with custom settings to be applied to the request.

- `method`: The request method (e.g. GET or POST).
- `headers`: An instance [Headers](#headers-class) or an object literal containing header-name/value pairs.
- `body`: The body of the request either as a [URLSearchParams](#urlsearchparams-class) object or as plain text (you will need to handle headers yourself with the latter). You cannot set a body for a GET or HEAD request.

Will be ignored if a [Request Class](#request-class) is used for the `resource` parameters.

### Return Value

The HTTP Request response as an instance of the [Response Class](#response-class).

### Example

```js
let response = fetch("https://example.com/resource", {
    method: "GET",
    headers: {
        "x-auth-key": "abc-123-xyz",
    },
});

if (response.ok) {
    let content = response.text();
}
else {
    console.error(`Failed to fetch resource – ${response.status}: ${response.statusText}`);
}
```

---

## Request Class

> 🔸 **Deviation from standards**
>
> - Limited set of options and properties available.
> - Limited format support for the request body.
> - The `text()` and `json()` methods return the content rather than a promise.
> - The body can be read multiple times.

The interface of the Fetch function which represents the resource request.

### Constructor

```js
new Request(input)
new Request(input, options)
```

#### `input`

Either:

- The URL of the resource as a string or a [URL](#url-class) object.
- Another Request object to be copied.

#### `options`

An object with custom settings to be applied to the request.

- `method`: The request method (e.g. GET or POST).
- `headers`: An instance [Headers](#headers-class) or an object literal containing header-name/value pairs.
- `body`: The body of the request either as a [URLSearchParams](#urlsearchparams-class) object or as plain text (you will need to handle headers yourself with the latter). You cannot set a body for a GET or HEAD request.

Will be ignored if a [Request Class](#request-class) is used for the `input` parameters.

### Properties

#### `body`

ℹ read-only

The raw content of the body. Use of the `text()` or `json()` methods is preferred over this non-standard property.

#### `headers`

ℹ read-only

Contains the associated [Headers](#headers-class) object.

#### `method`

ℹ read-only

The request method (e.g. POST, GET, etc.)

#### `url`

ℹ read-only

Contains the URL of the request as a string.

### Methods

#### `clone()`

Creates a copy of the current Request object.

#### `json()`

Returns the body as JSON.

#### `text()`

Returns the body as text.

### Example

```js
let r = new Request("https://example.com/resource", {method: "GET"});
```

---

## Response Class

> 🔸 **Deviation from standards**
>
> - Limited set of options and properties available.
> - Only supports text responses (no blobs). This is a limitations of synchronous XMLHttpRequest.
> - The `text()` and `json()` methods return the content rather than a promise.
> - The body can be read multiple times.

The interface of the Fetch function which represents the request response.

### Constructor

```js
new Response()
new Response(body)
new Response(body, options)
```

#### `body`

The content of the response body as text.

#### `options`

An object literal with the following possible entries:

- `status`: The numeric status code of the HTTP response.
- `statusText`: The text explanation that corresponds to the status code.
- `headers`: A [Headers](#headers-class) object, an object literal, or an iterable that defines the response headers.
- `url`: The URL of the response (non-standard).

### Properties

#### `body`

ℹ read-only

The raw content of the response body. Use of the `text()` or `json()` methods is preferred over this non-standard property.

#### `headers`

ℹ read-only

Contains the associated [Headers](#headers-class) object.

#### `ok`

ℹ read-only

Boolean indicating whether response was successful (200-299).

#### `status`

ℹ read-only

The status code fo the response.

#### `statusText`

ℹ read-only

The status message corresponding to the status code.

#### `url`

ℹ read-only

The URL of the response.

### Methods

#### `clone()`

Creates a copy of the current Request object.

#### `json()`

Returns the body as JSON.

#### `text()`

Returns the body as text.

### Example

```js
let response = fetch("https://example.com/resource.json");

if (response.ok) {
    let data = response.json();
}
else {
    console.error(`Failed to fetch resource – ${response.status}: ${response.statusText}`);
}
```

---

## Headers Class

Interface to work with headers for fetch requests.

### Constructor

```js
new Headers()
new Headers(init)
```

#### `init`

The headers with which to initialize in the form of an iterable that can be passed into a Map object or an object literal.

### Methods

#### `append(key, value)`

Appends a new value onto an existing header, creating it if it doesn't exist.

#### `delete(key)`

Remove the key-value pair from the headers.

#### `entries()`

Returns a new Iterator object that contains an array of [key, value] for each element in the headers object in insertion order.

#### `forEach(callbackFn, thisArg=undefined)`

Executes a provided function once for each key/value pair in the headers.

#### `get(key)`

Returns the value associated to the key, or null if there is none. If a header has multiple values, all values will be in the same string separated by a comma.

#### `has(key)`

Returns a boolean asserting whether a value has been associated to the key in the headers.

#### `keys()`

Returns a new Iterator object that contains the keys for each element in the headers object in insertion order.

#### `set(key , value)`

Sets the value for the key in the headers.

#### `values()`

Returns a new Iterator object that contains the values for each element in the header object in insertion order.

### Example

```js
let h = new Headers({"x-one": "alpha"});
h.append("x-one", "beta");
let x1 = h.get("x-one"); // x1 => "alpha, beta"
```

---

## URL Class

> 🔸 **Deviation from standards**
>
> - Does not implement the `createObjectURL(object)` and `revokeObjectURL(objectURL)` static methods.

Interface used to parse, construct, normalize, and encode URLs.

### Constructor

```js
new URL(url)
new URL(url, base)
```

#### `url`

Absolute or relative URL as a string. If the URL is relative, the base parameter is required.

#### `base`

The base URL to a relative `url` parameter. Ignored if the `url` parameters is an absolute URL.

### Properties

#### `hash`

String containing a # followed by the fragment identifier of the URL.

#### `host`

String containing the domain (i.e. hostname) followed by the port (if applicable).

#### `hostname`

String containing the domain of the URL.

#### `href`

The entire URL as a string.

#### `origin`

ℹ read-only

String containing the origin of the URL (scheme, domain, and port).

#### `password`

String containing password specified before the domain name.

#### `pathname`

String containing an initial "/" followed by the path of the URL, not including the query string nor the fragment.

#### `port`

String containing the port number of the URL (if one was specified).

#### `protocol`

String containing the protocol scheme of the URL, including the final ":".

#### `search`

String indicating the URL's parameter string, if any. Begins with the "?" character.

#### `searchParams`

ℹ read-only

A [URLSearchParams](#urlsearchparams-class) object which can be used to access individual query parameters.

#### `username`

String containing the username specified before the domain name.

### Methods

#### `toString()`

Returns a string containing the whole URL. Equivalent to the URL.href property.

#### `toJSON()`

Return a string containing the whole URL. Equivalent to the URL.href property.

### Example

```js
let url = new URL("http://example.com/one/two/?alpha=A");
url.searchParams.set("beta", "B");
url.protocol = "https";
let link = url.href; // link => "https://example.com/one/two?alpha=A&beta=B"
```

```js
let url = new URL("../folder/", "https://example.com/one/two/?alpha=A");
let link = url.href; // link => "https://example.com/one/folder/"
```

---

## URLSearchParams Class

> 🔸 **Deviation from standards**
>
> - Does not support duplicate search parameters and therefore does not support the `append()` nor the `getAll()` methods.

Interface to work with the query string of a URL.

### Constructor

```js
new URLSearchParams()
new URLSearchParams(init)
```

#### `init`

The search parameters with which to initialize. One of:

- A query string (e.g. `alpha=one&beta=two`). Will ignore the question mark at the beginning of the string if present.
- Any iterable that can be passed into a Map object.
- An object literal.

### Methods

#### `delete(key)`

Remove the key-value pair from the search parameters.

#### `entries()`

Returns a new Iterator object that contains an array of [key, value] for each element in the search parameters object in insertion order.

#### `forEach(callbackFn, thisArg=undefined)`

Executes a provided function once for each key/value pair in the search parameters.

#### `get(key)`

Returns the value associated to the key, or null if there is none.

#### `has(key)`

Returns a boolean asserting whether a value has been associated to the key in the search parameters.

#### `keys()`

Returns a new Iterator object that contains the keys for each element in the search parameters object in insertion order.

#### `set(key , value)`

Sets the value for the key in the search parameters.

#### `sort()`

Sort all key/value pairs, if any, by their keys.

#### `toString()`

Returns a string containing a query string suitable for use in a URL (without the starting question mark).

#### `values()`

Returns a new Iterator object that contains the values for each element in the search parameters object in insertion order.

### Example

```js
let usp = new URLSearchParams("alpha=one&beta=two");
usp.set("omega", "zero");
usp.delete("beta");
let query = usp.toString(); //query => "alpha=one&omega=zero"
```

---

## Licensing

Copyright 2022 Esri Canada - All Rights Reserved

A copy of the license is available in the repository's [LICENSE](../master/LICENSE) file.

## Support

This code is distributed as is and is not supported in any way by Esri Canada, Esri Inc. or any other Esri distributor.
