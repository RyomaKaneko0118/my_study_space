const redirect = "https://example.com/search?q=apple&category=fruits&page=1"
const queryString = redirect.indexOf("?") !== -1 ? redirect.substring(redirect.indexOf("?")) : ""
const query = queryString.substring(1).split("&").map((p) => p.split("=")).reduce((obj, e), ({ ...obj, [e[0]]: e[1]}), {})