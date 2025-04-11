import GrafanaService from '../services/grafanaService.js';

export const searchNamespaces = async (req, res) => {
  try {
    const { query, dataSource, username, password } = req.body;
    const authHeader = req.headers.authorization;

    // Create auth header for Grafana if credentials are provided
    const grafanaAuthHeader = username && password 
      ? 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64')
      : authHeader;

    const grafanaService = new GrafanaService(process.env.GRAFANA_BASE_URL, grafanaAuthHeader);
    const results = await grafanaService.searchNamespaces(query, dataSource);

    res.json(results);
  } catch (error) {
    console.error('Error searching namespaces:', error);
    res.status(500).json({ error: 'Failed to search namespaces' });
  }
};