# CSRF vs. SSRF

The objective of this repo is to help clarify the difference between CSRF and SSRF. It also acts as a supplement to a [video]() on the [Snyk YouTube channel](youtube.com/snyksec). This contains demos for both CSRF and SSRF examples.

## What's the difference?

The short answer is CSRF happens via the browser to server communications and SSRF happens via the main server and other server/API communication in the backend.

## Set Up

### CSRF

1. `cd csrf-demo`
2. `npm install`
3. `node server.js`
4. Open a, separate, new terminal/command line
5. `cd attacker`
6. `npx http-server -p 3001`
7. Open your browser to [http://localhost:3000](http://localhost:3000)
8. Sign in as `user1` with password `password1` and take note of the balance
9. Open a new tab or browser to [http://localhost:3001](http://localhost:3001) and open the developer tools Network tab
10. Click on `malicious.html` to execute the CSRF attack against localhost:3000. Make note of how the request in the network tab includes the Cookie header with the user1 session
11. Back in the original tab/browser at localhost:3000 refresh to see the balance changed

### SSRF

1. `cd ssrf-demo`
2. `npm install`
3. `node server.js`
4. Using a REST client of your choice make a POST request like the one below

```
POST localhost:3001/ssrf
Content-Type: application/json

{
    "url": "https://snyk.io"
}
```
