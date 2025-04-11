import AppDynamicsService from '../services/appDynamicsService.js';

export const searchApplications = async (req, res) => {
  try {
    const { searchText } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization token is required' });
    }

    if (!searchText) {
      return res.status(400).json({ error: 'Search text is required' });
    }

    const appDynamicsService = new AppDynamicsService(
      process.env.APPDYNAMICS_BASE_URL, 
      authHeader
    );
    
    const results = await appDynamicsService.searchApplications(searchText);
    res.json(results);
  } catch (error) {
    console.error('Error searching applications:', error);
    res.status(500).json({ 
      error: error.message,
      stack: error.stack 
    });
  }
};
