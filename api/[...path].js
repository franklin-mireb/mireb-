import server from '../backend/server.js';

export default async function handler(req, res) {
  // Let express handle the request
  return server(req, res);
}
