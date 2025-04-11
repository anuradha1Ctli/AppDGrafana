import AppDynamicsService from '../services/appDynamicsService.js';

export const fetchMetricsByServiceName = async (req, res) => {
  try {
    const { 
      applicationId, 
      nodeId, 
      componentId, 
      startDateTime, 
      endDateTime 
    } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization token is required' });
    }

    if (!applicationId || !componentId) {
      return res.status(400).json({ 
        error: 'Application ID and Component ID are required',
        details: {
          applicationId: applicationId || 'Missing',
          componentId: componentId || 'Missing'
        }
      });
    }

    const appDynamicsService = new AppDynamicsService(
      process.env.APPDYNAMICS_BASE_URL, 
      authHeader
    );

    // Fetch both entity stats and exceptions data
    const [entityStats, exceptionsData] = await Promise.all([
      appDynamicsService.fetchEntityStatsGraphData(
        componentId,
        startDateTime,
        endDateTime
      ),
      appDynamicsService.fetchExceptionsPerMinute(
        applicationId,
        componentId,
        startDateTime,
        endDateTime
      )
    ]);

    // Combine the metrics data
    const metrics = {
      ...entityStats,
      ...exceptionsData
    };

    res.json(metrics);
  } catch (error) {
    console.error('Error in fetchMetricsByServiceName:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
