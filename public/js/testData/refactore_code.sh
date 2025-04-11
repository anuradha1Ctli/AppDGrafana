#!/bin/bash

# Set colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Project root directory
PROJECT_ROOT="/Users/tulkumar/Desktop/Tulesh/Office/Code/test/logLense"

# Function to create directories
create_directories() {
    echo -e "${YELLOW}Creating project structure...${NC}"
    mkdir -p "$PROJECT_ROOT/src/controllers"
    mkdir -p "$PROJECT_ROOT/src/services"
    mkdir -p "$PROJECT_ROOT/src/middleware"
    mkdir -p "$PROJECT_ROOT/src/utils"
}

# Function to update package.json
update_package_json() {
    echo -e "${YELLOW}Updating package.json...${NC}"
    cat > "$PROJECT_ROOT/package.json" << EOL
{
  "name": "loglense",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  },
  "dependencies": {
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "node-fetch": "^3.3.1"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
EOL
}

# Function to create .env file
create_env_file() {
    echo -e "${YELLOW}Creating .env file...${NC}"
    cat > "$PROJECT_ROOT/.env" << EOL
PORT=3000
APPDYNAMICS_BASE_URL=https://centurylink-nonprod.saas.appdynamics.com
NODE_ENV=development
EOL
}

# Function to create metric extractor utility
create_metric_extractor() {
    echo -e "${YELLOW}Creating metric extractor utility...${NC}"
    cat > "$PROJECT_ROOT/src/utils/metricExtractor.js" << EOL
export function extractMaxValue(dataArray, metricName) {
  if (!dataArray || dataArray.length === 0) {
    return 0;
  }

  const values = dataArray.map(item => item.value || 0);
  const maxValue = Math.max(...values);

  return maxValue;
}
EOL
}

# Function to create AppDynamics service
create_appdynamics_service() {
    echo -e "${YELLOW}Creating AppDynamics service...${NC}"
    cat > "$PROJECT_ROOT/src/services/appDynamicsService.js" << EOL
import fetch from 'node-fetch';
import { extractMaxValue } from '../utils/metricExtractor.js';

class AppDynamicsService {
  constructor(baseUrl, authHeader) {
    this.baseUrl = baseUrl;
    this.authHeader = authHeader;
  }

  async searchApplications(searchText) {
    const appUrl = new URL(\`\${this.baseUrl}/controller/restui/application/search/apm/\${searchText}\`);
    const response = await fetch(appUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.authHeader
      }
    });

    if (!response.ok) {
      throw new Error(\`AppDynamics API responded with status: \${response.status}\`);
    }

    const data = await response.json();
    return {
      searchResults: data || []
    };
  }

  async searchServices(applicationId, startDateTime, endDateTime) {
    const response = await fetch(\`\${this.baseUrl}/controller/restui/v1/tiers/list/health\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.authHeader
      },
      body: JSON.stringify({
        requestFilter: {
          queryParams: {
            applicationId: applicationId,
            performanceDataFilter: "REPORTING",
            tags: []
          },
          filterAll: false,
          filters: []
        },
        resultColumns: ["TIER_NAME"],
        offset: 0,
        limit: -1,
        searchFilters: [],
        columnSorts: [
          {
            column: "HEALTH",
            direction: "DESC"
          }
        ],
        timeRangeStart: startDateTime,
        timeRangeEnd: endDateTime
      })
    });

    if (!response.ok) {
      throw new Error(\`AppDynamics API responded with status: \${response.status}\`);
    }

    return await response.json();
  }

  async fetchMetricsByServiceName(applicationId, nodeId, componentId, startDateTime, endDateTime) {
    try {
      const [
        entityStatsData, 
        exceptionsData
      ] = await Promise.all([
        this.fetchEntityStatsGraphData(componentId, startDateTime, endDateTime),
        this.fetchExceptionsPerMinute(applicationId, componentId, startDateTime, endDateTime)
      ]);

      return {
        applicationId,
        nodeId,
        componentId,
        ...entityStatsData,
        ...exceptionsData
      };
    } catch (error) {
      console.error('Error fetching metrics by service name:', error);
      return {
        applicationId,
        nodeId,
        componentId,
        Max_Average_Response_Time_ms: 0,
        Max_Calls_Per_Minute: 0,
        Max_Errors_Per_Minute: 0,
        Max_Num_Of_Slow_Calls: 0,
        Max_Num_Of_Very_Slow_Calls: 0,
        Max_Exceptions_Per_Minute: 0
      };
    }
  }

  async fetchEntityStatsGraphData(componentId, startDateTime, endDateTime) {
    try {
      const timeRange = \`Custom_Time_Range.BETWEEN_TIMES.\${endDateTime}.\${startDateTime}.0\`;
      
      const url = \`\${this.baseUrl}/controller/restui/dashboardUiService/entityStatsGraphData/\${componentId}?entityType=APPLICATION_COMPONENT&time-range=\${encodeURIComponent(timeRange)}&baselineId=-1&maxNumDataPoints=1440\`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': this.authHeader
        }
      });

      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
      }

      const additionalMetrics = await response.json();

      return {
        Max_Average_Response_Time_ms: extractMaxValue(additionalMetrics.averageResponseTimeData, 'Average Response Time'),
        Max_Calls_Per_Minute: extractMaxValue(additionalMetrics.callsPerMinuteData, 'Calls per Minute'),
        Max_Errors_Per_Minute: extractMaxValue(additionalMetrics.errorsPerMinuteData, 'Errors per Minute'),
        Max_Num_Of_Slow_Calls: extractMaxValue(additionalMetrics.numOfSlowCallsData, 'Number of Slow Calls'),
        Max_Num_Of_Very_Slow_Calls: extractMaxValue(additionalMetrics.numOfVerySlowCallsData, 'Number of Very Slow Calls')
      };
    } catch (error) {
      console.error('Error fetching additional metrics:', error);
      return {
        Max_Average_Response_Time_ms: 0,
        Max_Calls_Per_Minute: 0,
        Max_Errors_Per_Minute: 0,
        Max_Num_Of_Slow_Calls: 0,
        Max_Num_Of_Very_Slow_Calls: 0
      };
    }
  }

  async fetchExceptionsPerMinute(applicationId, componentId, startDateTime, endDateTime) {
    try {
      const timeRange = \`Custom_Time_Range.BETWEEN_TIMES.\${endDateTime}.\${startDateTime}.0\`;
      
      const url = \`\${this.baseUrl}/controller/restui/errors/chartdata?applicationId=\${applicationId}&entityType=APPLICATION_COMPONENT&entityId=\${componentId}&time-range=\${encodeURIComponent(timeRange)}\`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': this.authHeader
        }
      });

      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
      }

      const exceptionsData = await response.json();
      return {
        Max_Exceptions_Per_Minute: extractMaxValue(exceptionsData.exceptionCountData, 'Exceptions per Minute')
      };
    } catch (error) {
      console.error('Error fetching exceptions per minute:', error);
      return {
        Max_Exceptions_Per_Minute: 0
      };
    }
  }
}

export default AppDynamicsService;
EOL
}

# Function to create controllers
create_controllers() {
    echo -e "${YELLOW}Creating controllers...${NC}"
    
    # Application Controller
    cat > "$PROJECT_ROOT/src/controllers/applicationController.js" << EOL
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
EOL

    # Service Controller
    cat > "$PROJECT_ROOT/src/controllers/serviceController.js" << EOL
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
EOL

    # Metrics Controller
    cat > "$PROJECT_ROOT/src/controllers/metricsController.js" << EOL
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

    const metrics = await appDynamicsService.fetchMetricsByServiceName(
      applicationId, 
      nodeId, 
      componentId, 
      startDateTime, 
      endDateTime
    );

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
EOL
}

# Function to create middleware
create_middleware() {
    echo -e "${YELLOW}Creating middleware...${NC}"
    cat > "$PROJECT_ROOT/src/middleware/authMiddleware.js" << EOL
export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization token is required' });
  }
  
  next();
};
EOL
}

# Function to create main server file
create_server_file() {
    echo -e "${YELLOW}Creating server.js...${NC}"
    cat > "$PROJECT_ROOT/src/server.js" << EOL
import express from 'express';
import dotenv from 'dotenv';
import { searchApplications } from './controllers/applicationController.js';
import { searchServices } from './controllers/serviceController.js';
import { fetchMetricsByServiceName } from './controllers/metricsController.js';
import { requireAuth } from './middleware/authMiddleware.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static("public"));

// Routes with authentication middleware
app.post('/api/applications/search', requireAuth, searchApplications);
app.post('/api/services/search', requireAuth, searchServices);
app.post('/api/metrics/byservicename', requireAuth, fetchMetricsByServiceName);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

app.listen(port, () => {
  console.log(\`Server running on port \${port}\`);
});
EOL
}

# Main execution
main() {
    echo -e "${GREEN}Starting project refactoring...${NC}"
    
    # Create directories
    create_directories
    
    # Create files
    update_package_json
    create_env_file
    create_metric_extractor
    create_appdynamics_service
    create_controllers
    create_middleware
    create_server_file
    
    echo -e "${GREEN}Refactoring complete! 🎉${NC}"
    echo -e "${YELLOW}Next steps:${NC}"
    echo "1. Run 'npm install' to install dependencies"
    echo "2. Create a .env file with your AppDynamics credentials"
    echo "3. Run 'npm start' to start the server"
}

# Run the main function
main