import AppDynamicsService from '../services/appDynamicsService.js';

export const searchServices = async (req, res) => {
  try {
    const { applicationId, startDateTime, endDateTime } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization token is required' });
    }

    if (!applicationId) {
      return res.status(400).json({ error: 'Application ID is required' });
    }

    const appDynamicsService = new AppDynamicsService(
      process.env.APPDYNAMICS_BASE_URL, 
      authHeader
    );

    const services = await appDynamicsService.searchServices(
      applicationId, 
      startDateTime, 
      endDateTime
    );

    res.json(services);
  } catch (error) {
    console.error('Error searching services:', error);
    res.status(500).json({ 
      error: error.message,
      stack: error.stack 
    });
  }
};
