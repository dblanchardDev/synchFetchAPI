//¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯ FETCH API ¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯\\
/**
 * Fetch Implementation for Synchronous ES6
 * @description Adds a basic version of fetch and its related objects to a synchronous ES6 only environment
 * @author David Blanchard
 * @license MIT License
 */


/**
 * Convert unknown content into a string for use within fetch implementation classes and functions.
 * @private
 * @param {any} thing - the thing to convert to a string.
 * @returns {string}
 */
const _STRINGIFY = function(thing) {
	"use strict";

	// Preset strings according to type
	if (thing === null) return "null";
	if (thing === true) return "true";
	if (thing === false) return "false";
	if (thing === undefined) return "undefined";
	if (Array.isArray(thing)) return "";
	if (typeof thing === "object") return "object";
	if (typeof thing === "function") return "function";

	// Convert all others into string
	return thing + "";
};

// ============================================================================

/** Internal base class for map like classes.
 * @private
 */
class _StringMap {

	/**
	 * Create an extended map.
	 * @param {Iterable} init - Content with which to initiate the extended map.
	 * @param {boolean} lowerKey - Whether all keys are to be stored in lowercase.
	 */
	constructor(init=undefined, lowerKey=false) {
		this._map = new Map();
		this._lowerKey = lowerKey;
		if (init !== undefined) this._parseInit(init);
	}


	/**
	 * Change key to all lowercase only if _lowerKey is true.
	 * @param {string} key
	 * @returns {string}
	 */
	_lower(key) {
		if (this._lowerKey) return key.toLowerCase();
		return key;
	}


	/**
	 * Parse an iterable into the map.
	 * @private
	 * @param {Iterable} init - Content with which to populate the map.
	 */
	_parseInit(init) {
		let entries;

		try {
			entries = new Map(init).entries();
		}
		catch (TypeError) {
			entries = Object.entries(init);
		}

		for (let [key, value=""] of entries) {
			key = this._lower(_STRINGIFY(key));
			value = _STRINGIFY(value);
			this.set(key, value);
		}
	}


	/**
	 * Remove the key-value pair from the map.
	 * @param {string} key - Key to be deleted.
	 */
	delete(key) {
		key = this._lower(_STRINGIFY(key));
		this._map.delete(key);
	}


	/**
	 * Returns a new Iterator object that contains an array of [key, value] for each element in the map object in insertion order.
	 * @returns {Iterator}
	 */
	entries() {
		return this._map.entries();
	}


	/**
	 * Executes a provided function once for each key/value pair in this map object.
	 * @param {function(value, key, object)} callbackFn
	 * @param {object} thisArg
	 */
	forEach(callbackFn, thisArg=undefined) {
		this._map.forEach(callbackFn, thisArg);
	}


	/**
	 * Returns the value associated to the key, or null if there is none.
	 * @param {any} key - key to be looked up.
	 * @returns {string}
	 */
	get(key) {
		key = this._lower(_STRINGIFY(key));
		let value = this._map.get(key);
		if (value == undefined) value = null;
		return value;
	}


	/**
	 * Returns a boolean asserting whether a value has been associated to the key in the map object.
	 * @param {string} key - key to be checked for existence
	 * @returns {boolean}
	 */
	has(key) {
		key = this._lower(_STRINGIFY(key));
		return this._map.has(key);
	}


	/**
	 * Returns a new Iterator object that contains the keys for each element in the map object in insertion order.
	 * @returns {Iterator}
	 */
	keys() {
		return this._map.keys();
	}


	/**
	 * Sets the value for the key in the map object.
	 * @param {string} key
	 * @param {string} value
	 */
	set(key, value) {
		key = this._lower(_STRINGIFY(key));
		value = _STRINGIFY(value);
		this._map.set(key, value);
	}


	/**
	 * Returns a new Iterator object that contains the values for each element in the map object in insertion order.
	 * @returns {Iterator}
	 */
	values() {
		return this._map.values();
	}


	/** Map iterator symbol (used in for...of loop for example)*/
	[Symbol.iterator]() {
		return this._map[Symbol.iterator]();
	}

}

// ============================================================================

/** Interface to work with the query string of a URL. */
class URLSearchParams extends _StringMap { // eslint-disable-line no-redeclare

	/**
	 * Parse an iterable into the map.
	 * @private
	 * @override
	 * @param {any} init - Content with which to populate the map.
	 */
	_parseInit(init) {
		if (typeof init === "object" && init !== null) {
			super._parseInit(init);
		}
		else {
			init = _STRINGIFY(init);
			if (init.length > 0) {
				if (init.startsWith("?")) init = init.slice(1);

				const pairs = init.split("&");
				for (let p of pairs) {
					let [key, value=""] = p.split("=");
					this.set(key, value);
				}
			}
		}
	}


	/** Sort all key/value pairs, if any, by their keys. */
	sort() {
		let keys = Array.from(this.keys()).sort();
		for (let k of keys) {
			let v = this.get(k);
			this.delete(k);
			this.set(k, v);
		}
	}

	/** Returns a string containing a query string suitable for use in a URL. */
	toString() {
		let parts = [];
		for (let [n, v] of this.entries()) {
			parts.push(`${n}=${v}`);
		}
		return parts.join("&");
	}

}

// ============================================================================

/** Interface used to work with headers for a fetch request. */
class Headers extends _StringMap { // eslint-disable-line no-redeclare

	/**
	 * Create a new Headers object.
	 * @param {any} init - Content to initialize the headers.
	 */
	constructor(init=undefined) {
		super(init, true);
	}


	/**
	 * Appends a new value onto an existing header, creating it if it doesn't exist.
	 * @param {string} key
	 * @param {string} value
	 */
	append(key, value) {
		key = this._lower(_STRINGIFY(key));
		value = _STRINGIFY(value);

		const curValue = this.get(key);
		if (curValue === null) {
			this.set(key, value);
		}
		else {
			let newSet = curValue.split(",").map(v=>v.trim());
			newSet.push(value);
			this.set(key, newSet.join(", "));
		}
	}

}

// ============================================================================

/** Interface used to parse, construct, normalize, and encode URLs. */
class URL { // eslint-disable-line no-redeclare

	/**
	 * Create a new URL object.
	 * @param {string} url - Absolute or relative URL to use to initialize. If url is relative, the base parameter is required.
	 * @param {string} base - Used as the base URL to a relative url parameter. Ignored if url parameter is absolute.
	 */
	constructor(url, base=undefined) {
		if (url instanceof URL) {
			url = url.href;
			base = undefined;
		}

		const rebase = base !== undefined && url.includes("://") == false;
		url = _STRINGIFY(url);
		base = _STRINGIFY(base);

		// Set defaults
		this._hash = "";
		this._hostname = null;
		this._password = "";
		this._pathname = "/";
		this._port = "";
		this._protocol = null;
		this._scheme = null;
		this._searchParams = new URLSearchParams();
		this._username = "";

		// Parse the URLs
		this._parseURL(rebase ? base : url);
		if (rebase && url !== "") this._rebase();
	}


	/**
	 * Parse an absolute URL string into its components.
	 * @private
	 * @param {string} url
	 */
	_parseURL(url) {
		url = _STRINGIFY(url);
		const parts = URL._URL_Extract.exec(url);
		if (parts === null) URL._invalid(url);

		// Simple Properties
		this.hash = parts[5];
		this.pathname = parts[3];
		this.protocol = parts[1];
		this.search = parts[4];

		// Deconstruct the host
		let host = parts[2];
		if (host.includes("@")) {
			let pw = host.split("@")[0];
			host = host.split("@")[1];

			let pwParts = pw.split(":");
			if (pwParts.length < 1 || pwParts > 2) URL._invalid(url);
			this.username = pwParts[0];
			this.password = pwParts == 2 ? pwParts[1] : "";
		}

		this.host = host;
	}


	/**
	 * Adjust the current absolute URL using a new relative URL
	 * @param {string} url - relative URL
	 */
	_rebase(url) {
		// Squash existing pathname (/abc)
		if (url.startsWith("/")) {
			this._parseURL(this._base + url);
		}

		// Otherwise, relative adjustments
		else {
			if (url.startsWith("./")) url = url.substring(2);
			let reduceBy = url.match(/^(?:\.\.\/)*/)[0].length / 3;

			let baseParts = this.pathname.split("/");
			let adjReduceBy = Math.max(baseParts.length - reduceBy - 1, 1);
			baseParts = baseParts.slice(0, adjReduceBy);

			let updateParts = url.substring(reduceBy * 3).split("/");
			let newPath = baseParts.concat(updateParts).join("/");
			this._parseURL(this._base + newPath);
		}
	}


	/** The base of the URL up to pathname (protocol, credentials, hostname, port).
	 * @private
	 * @readonly
	 */
	get _base() {
		let value = this.protocol + "//";
		if (this.username) value += `${this.username}:${this.password}@`;
		value += this.host;
		return value;
	}


	/** String containing a # followed by the fragment identifier of the URL. */
	get hash() {
		return this._hash;
	}

	set hash(value) {
		value = _STRINGIFY(value);
		if (value != "" && value.startsWith("#") == false) {
			value = `#${value}`;
		}
		this._hash = value;
	}


	/** String containing the domain (i.e. hostname) followed by the port if applicable. */
	get host() {
		if (this.port == "") return this.hostname;
		return `${this.hostname}:${this.port}`;
	}

	set host(value) {
		let parts = value.split(":");

		if (parts.length > 2) URL._invalid(value);
		this.hostname = parts[0];
		this.port = parts[1] ?? "";
	}


	/** String containing the domain of the URL. */
	get hostname() {
		return this._hostname;
	}

	set hostname(value) {
		value = _STRINGIFY(value);
		if (value.length > 0) this._hostname = value;
	}


	/** The entire URL as a string. */
	get href() {
		return this._base + this.pathname + this.search + this.hash;
	}

	set href(value) {
		value = _STRINGIFY(value);
		this.parseURL(value);
	}


	/** String containing the origin of the URL (scheme, domain, and port).
	 * @readonly
	 */
	get origin() {
		return `${this._protocol}//${this.host}`;
	}


	/** String containing password specified before the domain name. */
	get password() {
		return this._password;
	}

	set password(value) {
		this._password = _STRINGIFY(value);
	}


	/** String containing an initial '/' followed by the path of the URL, not including the query string nor the fragment. */
	get pathname() {
		return this._pathname;
	}

	set pathname(value) {
		value = _STRINGIFY(value);
		if (value.startsWith("/") == false) value = `/${value}`;
		this._pathname = value;
	}


	/** String containing the port number of the URL. */
	get port() {
		return this._port;
	}

	set port(value) {
		value = _STRINGIFY(value);
		if (!isNaN(value) && parseInt(value) == value) {
			this._port = value;
		}
	}


	/** String containing the protocol scheme of the URL, including the final ':'. */
	get protocol() {
		return this._protocol;
	}

	set protocol(value) {
		value = _STRINGIFY(value);
		if (value.endsWith(":") == false) value += ":";
		this._protocol = value;
	}


	/** String indicating the URL's parameter string, if any. Begins with the '?' character. */
	get search() {
		let searchStr = this.searchParams.toString();
		if (searchStr.length > 0) searchStr = `?${searchStr}`;
		return searchStr;
	}

	set search(value) {
		value = _STRINGIFY(value);
		this._searchParams = new URLSearchParams(value);
	}


	/** A URLSearchParams object which can be used to access individual query parameters.
	 * @readonly
	 */
	get searchParams() {
		return this._searchParams;
	}


	/** String containing the username specified before the domain name. */
	get username() {
		return this._username;
	}

	set username(value) {
		this._username = _STRINGIFY(value);
	}


	/** Returns a string containing the whole URL. Equivalent to URL.href. */
	toString() {
		return this.href;
	}


	/** Returns a string containing the whole URL. Equivalent to URL.href. */
	toJSON() {
		return this.href;
	}


	/** Regular expression used to partially parse absolute URL.
	 * @private
	 * @returns {RegExp}
	 */
	static get _URL_Extract() {
		if (this._url_regex == undefined) {
			this._url_regex = new RegExp("^(.+?)://([^/?#]+)(/?[^?#]*)([^#]*)(#?.*)$");
		}
		return this._url_regex;
	}


	/**
	 * Throw an error due to an invalid URL.
	 * @private
	 * @param {string} url - URL which caused the error
	 */
	static _invalid(url) {
		throw new TypeError(`URL constructor: ${url} is not a valid URL.`);
	}


	/** This static method is not implemented and will throw an error. */
	static createObjectURL(object) { //eslint-disable-line no-unused-vars
		throw Error("Static URL.createObjectURL not implemented. No alternatives available.");
	}

	/** This static method is not implemented and will throw an error. */
	static revokeObjectURL(objectURL) { //eslint-disable-line no-unused-vars
		throw Error("Static URL.revokeObjectURL not implemented. No alternatives available.");
	}

}

// ============================================================================

/** Shared properties between Request and Response. */
class _FetchInterface {

	/** Contains the associated Headers object.
	 * @readonly
	 */
	get headers() {
		return this._headers;
	}


	/** The raw content of the body. Use of the text() or json() method is preferred over this non-standard property.
	 * @readonly
	 */
	get body() {
		return this._body;
	}


	/** Returns the results of parsing the body as JSON. */
	json() {
		return JSON.parse(this.body);
	}


	/** Returns the text representation of the body. */
	text() {
		return this.body + "";
	}
}

// ============================================================================

/** The interface of the Fetch function, representing the resource request. */
class Request extends _FetchInterface { //eslint-disable-line no-redeclare

	/**
	 * Create a new request object.
	 * @param {string|Request} input - URL or Request to copy
	 * @param {{method, headers, body}} options
	 */
	constructor(input, options=undefined) {
		super();

		// Set default options
		options = Object.assign(Request._defaultOptions, options);

		// Copy another Request instance
		if (input instanceof Request) this._initCopy(input);

		// Create a brand-new Request instance
		else this._initNew(input, options);
	}


	/** Initialize through copying another Request.
	 * @private
	 */
	_initCopy(input) {
		this._url = new URL(input.url);
		this._method = input.method;
		this._headers = new Headers(input.headers);
		this._body = input.body;
	}


	/** Initialize from new properties.
	 * @private
	 */
	_initNew(input, options) {
		this._url = new URL(input);
		this._method = _STRINGIFY(options.method);
		this._headers = new Headers(options.headers);
		this._body = null;

		if (options.body !== null && options.body !== undefined && options.body !== "") {
			// Body not allowed for HEAD and GET requests
			if (["HEAD", "GET"].includes(this.method)) {
				throw new TypeError("Request constructor: HEAD or GET Request cannot have a body.");
			}

			// Set URLSearchParams body & add required header
			else if (options.body instanceof URLSearchParams) {
				this._body = options.body.toString();
				this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8");
			}

			// Any other case, assume string body (header must be manually set)
			else {
				this._body = _STRINGIFY(options.body);
			}
		}
	}


	/** The request method (e.g. GET, POST, etc.)
	 * @readonly
	 */
	get method() {
		return this._method;
	}


	/** Contains the URL of the request.
	 * @readonly
	 */
	get url() {
		return this._url.href;
	}


	/** Creates a copy of the current Request object. */
	clone() {
		return new Request(this);
	}


	/** Default options for initialization
	 * @private
	 */
	static get _defaultOptions() {
		return {
			method: "GET",
			headers: "",
			body: null,
		};
	}
}

// ============================================================================

/** The interface of the Fetch function, representing the response received. */
class Response extends _FetchInterface { //eslint-disable-line no-redeclare

	/**
	 * Create a new Response object.
	 * @param {string} body
	 * @param {{status, statusText, headers}} options
	 */
	constructor(body=null, options=undefined) {
		super();

		// Set default options
		options = Object.assign(Response._defaultOptions, options);

		// Initialize
		this._body = body;
		this._headers = new Headers(options.headers);
		this._status = this._parseStatus(options.status);
		this._statusText = _STRINGIFY(options.statusText);
		this._url = _STRINGIFY(options.url);
	}


	/** Parse the status code, ensuring it is numeric */
	_parseStatus(status) {
		status = _STRINGIFY(status);
		let parsed = parseInt(status);
		if (Number.isNaN(parsed) || parsed < 0) {
			throw new TypeError(`Unable to parse status code ${status}.`);
		}
		return parsed;
	}


	/** Boolean indicating whether response was successful (200-299).
	 * @readonly
	 */
	get ok() {
		return this.status !== null && this.status >= 200 && this.status <= 299;
	}


	/** The status code of the response.
	 * @readonly
	 */
	get status() {
		return this._status;
	}


	/** The status message corresponding to the status code.
	 * @readonly
	 */
	get statusText() {
		return this._statusText;
	}


	/** The URL of the response.
	 * @readonly
	 */
	get url() {
		return this._url;
	}


	/** Creates a copy of the current Request object. */
	clone() {
		return new Response(this.body, {
			status: this.status,
			statusText: this.statusText,
			headers: new Headers(this.headers),
			url: this.url,
		});
	}


	/** Default options for initialization
	 * @private
	 */
	static get _defaultOptions() {
		return {
			status: null,
			statusText: null,
			headers: "",
			url: null,
		};
	}
}

// ============================================================================

const fetch = function(resource, options) { // eslint-disable-line no-redeclare, no-unused-vars
	"use strict";

	// Create the request class
	let request;
	if (resource instanceof Request) request = resource;
	else request = new Request(new URL(resource), options);

	// Send the XMLHttpRequest
	const req = new XMLHttpRequest();
	req.open(request.method, request.url, false);

	for (let [key, value] of request.headers.entries()) {
		req.setRequestHeader(key, value);
	}

	try {
		req.send(request.body);
	}
	catch (DOMException) {
		// pass
	}

	// Read the response
	let headers = req.getAllResponseHeaders().trim().split(/[\r\n]+/).filter(v => v !== "").map(v => v.split(": "));

	return new Response(req.response, {
		status: req.status,
		statusText: req.statusText,
		headers: headers,
		url: req.responseURL,
	});
};

//_________________________________ FETCH API _______________________________//
