import fetch from 'node-fetch';
import { extractMaxValue } from '../utils/metricExtractor.js';

class AppDynamicsService {
  constructor(baseUrl, authHeader) {
    this.baseUrl = baseUrl;
    this.authHeader = authHeader;
  }

  async searchApplications(searchText) {
    const appUrl = new URL(`${this.baseUrl}/controller/restui/application/search/apm/${searchText}`);
    const response = await fetch(appUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.authHeader
      }
    });

    if (!response.ok) {
      throw new Error(`AppDynamics API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return {
      searchResults: data || []
    };
  }

  async searchServices(applicationId, startDateTime, endDateTime) {
    const response = await fetch(`${this.baseUrl}/controller/restui/v1/tiers/list/health`, {
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
      throw new Error(`AppDynamics API responded with status: ${response.status}`);
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
        'Max Average Response Time (ms)': entityStatsData.Max_Average_Response_Time_ms,
        'Max Calls per Minute': entityStatsData.Max_Calls_Per_Minute,
        'Max Errors per Minute': entityStatsData.Max_Errors_Per_Minute,
        'Max Number of Slow Calls': entityStatsData.Max_Num_Of_Slow_Calls,
        'Max Number of Very Slow Calls': entityStatsData.Max_Num_Of_Very_Slow_Calls,
        'Max Exceptions per Minute': exceptionsData.Max_Exceptions_Per_Minute
      };
    } catch (error) {
      console.error('Error fetching metrics by service name:', error);
      return {
        applicationId,
        nodeId,
        componentId,
        'Max Average Response Time (ms)': 0,
        'Max Calls per Minute': 0,
        'Max Errors per Minute': 0,
        'Max Number of Slow Calls': 0,
        'Max Number of Very Slow Calls': 0,
        'Max Exceptions per Minute': 0
      };
    }
  }

  async fetchEntityStatsGraphData(componentId, startDateTime, endDateTime) {
    try {
      const url = new URL(`${this.baseUrl}/controller/restui/dashboardui/service/getEntityStatsGraphData`);
      
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.authHeader
        },
        body: JSON.stringify({
          componentId: componentId,
          startDateTime: startDateTime,
          endDateTime: endDateTime
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch entity stats: ${response.status}`);
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
      console.error('Error fetching entity stats:', error);
      throw error;
    }
  }

  async fetchExceptionsPerMinute(applicationId, componentId, startDateTime, endDateTime) {
    try {
      const url = new URL(`${this.baseUrl}/controller/restui/dashboardui/service/getErrorsChartData`);
      
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.authHeader
        },
        body: JSON.stringify({
          applicationId: applicationId,
          componentId: componentId,
          startDateTime: startDateTime,
          endDateTime: endDateTime
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch exceptions data: ${response.status}`);
      }

      const exceptionsData = await response.json();
      return {
        Max_Exceptions_Per_Minute: extractMaxValue(exceptionsData.exceptionCountData, 'Exceptions per Minute')
      };
    } catch (error) {
      console.error('Error fetching exceptions data:', error);
      throw error;
    }
  }
}

export default AppDynamicsService;
