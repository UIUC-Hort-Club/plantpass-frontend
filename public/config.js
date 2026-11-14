// Local development config. Points at the local dev API, which you start with
// `make dev` in plantpass-backend (fake data, nothing saved, staff passphrase "dev").
// The deploy workflow overwrites this file with the production URLs.
window.APP_CONFIG = {
  API_ENDPOINT: 'http://localhost:8787',
  WEBSOCKET_URL: ''
};
