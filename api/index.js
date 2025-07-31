import app from '../backend/api.js';

export default async function handler(req, res) {
  return app(req, res);
}
