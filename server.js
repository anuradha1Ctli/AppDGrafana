// server.js
import fetch from "node-fetch";
import express from "express";
import { extractMaxValue } from './public/js/max_value.js';
import https from 'https';

const app = express();
const port = 3000; // You can change this if needed

// Create an HTTPS agent that ignores certificate errors for internal APIs
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

// Middleware to parse JSON bodies
app.use(express.json());

app.use(express.static("public")); // Serve the static files in the 'public' directory

// Namespace search endpoint
app.post('/api/namespaces/search', async (req, res) => {
  try {
    const { query, dataStream, username, password, start, end } = req.body;
    
    // Validate required fields
    if (!query || !dataStream || !username || !password || !start || !end) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required parameters',
        timestamp: new Date().toISOString()
      });
    }

    // Construct Grafana API URL
    const grafanaUrl = dataStream === 'odc' 
      ? 'https://grafana.kubeodc-test.corp.intranet/api/datasources/proxy/1/api/v1/series'
      : 'https://grafana.kubemdc-test.corp.intranet/api/datasources/proxy/1/api/v1/series';

    // Construct the query parameter
    const encodedQuery = encodeURIComponent(`kube_pod_info`);
    const url = `${grafanaUrl}?match[]=${encodedQuery}&start=${start}&end=${end}`;

    // Make request to Grafana API
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
        'Content-Type': 'application/json'
      },
      agent: httpsAgent // Add the HTTPS agent to ignore certificate errors
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || `Grafana API error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform Grafana response to our format
    const namespaces = data.data
      .filter(item => item.namespace)
      .map(item => ({
        namespace: item.namespace,
        container: item.container,
        created_by_kind: item.created_by_kind,
        created_by_name: item.created_by_name,
        endpoint: item.endpoint,
        host_ip: item.host_ip,
        instance: item.instance,
        job: item.job,
        node: item.node,
        pod: item.pod,
        pod_ip: item.pod_ip,
        service: item.service,
        uid: item.uid
      }));

    // Filter by query
    const filteredNamespaces = namespaces.filter(namespace => 
      namespace.namespace.toLowerCase().includes(query.toLowerCase())
    );

    res.json({ 
      success: true,
      searchResults: filteredNamespaces,
      query: query,
      totalResults: filteredNamespaces.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error searching namespaces:', error);
    // Return mock data on error
    return res.status(200).json({
      success: true,
      searchResults: [
        {
          namespace: "bmsc-dev",
          container: "kube-state-metrics",
          created_by_kind: "ReplicaSet",
          created_by_name: "bmp-address-business-service-dev-5cb6b8669d",
          endpoint: "http",
          host_ip: "148.156.83.67",
          instance: "148.155.210.15:8080",
          job: "kube-state-metrics",
          node: "pmdcpaas05-slot2.corp.intranet",
          pod: "bmp-address-business-service-dev-5cb6b8669d-s27ld",
          pod_ip: "148.155.211.38",
          service: "prometheus-kube-state-metrics",
          uid: "a58eef27-92c6-4922-8bf3-1c8d71ca13aa"
        },{
          namespace: "bmsc-dev-2",
          container: "kube-state-metrics",
          created_by_kind: "ReplicaSet",
          created_by_name: "bmp-address-business-service-dev-5cb6b8669d",
          endpoint: "http",
          host_ip: "148.156.83.67",
          instance: "148.155.210.15:8080",
          job: "kube-state-metrics",
          node: "pmdcpaas05-slot2.corp.intranet",
          pod: "bmp-address-business-service-dev-5cb6b8669d-s27ld",
          pod_ip: "148.155.211.38",
          service: "prometheus-kube-state-metrics",
          uid: "a58eef27-92c6-4922-8bf3-1c8d71ca13ab"
        },{
          namespace: "bmsc-dev-3",
          container: "kube-state-metrics",
          created_by_kind: "ReplicaSet",
          created_by_name: "bmp-address-business-service-dev-5cb6b8669d",
          endpoint: "http",
          host_ip: "148.156.83.67",
          instance: "148.155.210.15:8080",
          job: "kube-state-metrics",
          node: "pmdcpaas05-slot2.corp.intranet",
          pod: "bmp-address-business-service-dev-5cb6b8669d-s27ld",
          pod_ip: "148.155.211.38",
          service: "prometheus-kube-state-metrics",
          uid: "a58eef27-92c6-4922-8bf3-1c8d71ca13ac"
        }
      ],
      query: req.body.query,
      totalResults: 1,
      timestamp: new Date().toISOString()
    });
  }
});

// Application search endpoint
app.post('/api/applications/search', async (req, res) => {
  try {
    // Extract searchText from request body, NOT query
    const { searchText } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization token is required' });
    }

    if (!searchText) {
      return res.status(400).json({ error: 'Search text is required' });
    }


    // Construct the URL with query parameters
    const appUrl = new URL(`https://centurylink-nonprod.saas.appdynamics.com/controller/restui/application/search/apm/${searchText}`);
    const response = await fetch(appUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      }
    });

    console.log('AppDynamics Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AppDynamics API Error:', errorText);
      throw new Error(`AppDynamics API responded with status: ${response.status}`);
    }

    const data = await response.json();
    res.json({
      searchResults: data || []
    });
    
  } catch (error) {
    console.error('Error searching applications:', error);
    res.status(500).json({ 
      error: error.message,
      stack: error.stack 
    });
  }
});

// Services search endpoint
app.post('/api/services/search', async (req, res) => {
  try {
    const { applicationId, startDateTime, endDateTime } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization token is required' });
    }

    if (!applicationId) {
      return res.status(400).json({ error: 'Application ID is required' });
    }

    const response = await fetch('https://centurylink-nonprod.saas.appdynamics.com/controller/restui/v1/tiers/list/health', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
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
        resultColumns: [
          "TIER_NAME"
        ],
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

    const data = await response.json();
    // console.log('Services data:', JSON.stringify(data, null, 2));
    res.json(data);
  } catch (error) {
    console.error('Error searching services:', error);
    res.status(500).json({ error: error.message });
  }
});

// Function to fetch additional metrics from dashboard UI service
async function fetchEntityStatsGraphData(componentId, authorization, startDateTime, endDateTime) {
  try {
    const timeRange = `Custom_Time_Range.BETWEEN_TIMES.${endDateTime}.${startDateTime}.0`;
    
    const url = `https://centurylink-nonprod.saas.appdynamics.com/controller/restui/dashboardUiService/entityStatsGraphData/${componentId}?entityType=APPLICATION_COMPONENT&time-range=${encodeURIComponent(timeRange)}&baselineId=-1&maxNumDataPoints=1440`;
    console.log('fetchEntityStatsGraphData url:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': authorization
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
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

// Function to fetch exceptions per minute from errors chart data
async function fetchExceptionsPerMinute(applicationId, componentId, authorization, startDateTime, endDateTime) {
  try {
    const timeRange = `Custom_Time_Range.BETWEEN_TIMES.${endDateTime}.${startDateTime}.0`;
    
    const url = `https://centurylink-nonprod.saas.appdynamics.com/controller/restui/errors/chartdata?applicationId=${applicationId}&entityType=APPLICATION_COMPONENT&entityId=${componentId}&time-range=${encodeURIComponent(timeRange)}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': authorization
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const exceptionsData = await response.json();

    // console.log('## exceptionsData -\n' + JSON.stringify(exceptionsData, null, 2))

    // Extract max value for exceptions per minute
    const maxExceptionsPerMinute = extractMaxValue(
      exceptionsData.exceptionsData, 
      'Exceptions per Minute'
    );

    return {
      Max_Exceptions_Per_Minute: maxExceptionsPerMinute
    };
  } catch (error) {
    console.error('Error fetching exceptions per minute:', error);
    return {
      Max_Exceptions_Per_Minute: 0
    };
  }
}

// Endpoint to fetch metrics data by name
app.post('/api/metrics/byservicename', async (req, res) => {
  try {
    const { applicationId, nodeId, componentId, startDateTime, endDateTime } = req.body;
    
    const timeRange = `Custom_Time_Range.BETWEEN_TIMES.${endDateTime}.${startDateTime}.0`;
    
    // Fetch original metrics
    const response = await fetch('https://centurylink-nonprod.saas.appdynamics.com/controller/restui/metricDataManager/getMetricDataByName', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.authorization
      },
      body: JSON.stringify({
        applicationId: applicationId,
        maxDataPointsPerMetric: 976,
        metricNames: [
          "JVM|Memory:Heap|Current Usage (MB)",
          "JVM|Memory:Heap|Max Available (MB)",
          "JVM|Memory:Heap|Committed (MB)",
          "JVM|Memory:Heap|Used %",
          "JVM|Garbage Collection|GC Time Spent Per Min (ms)",
          "JVM|Process CPU Usage %",
          "JVM|Threads|Current No. of Threads"
        ],
        nodeId: nodeId,
        timeRange: timeRange
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    console.log('nodeId:', nodeId);
    console.log('ApplicationId  :', applicationId);
    console.log('ComponentId    :', componentId);
    
    // Fetch additional metrics
    const entityStatsGraphData = await fetchEntityStatsGraphData(componentId, req.headers.authorization, startDateTime, endDateTime);

    // Fetch exceptions per minute
    const exceptionsPerMinute = await fetchExceptionsPerMinute(applicationId, componentId, req.headers.authorization, startDateTime, endDateTime);

    // Combine the two sets of metrics
    const combinedMetrics = [
      ...data,
      {
        metricName: "Max Average Response Time (ms)",
        dataPoints: [{ metricValue: { value: entityStatsGraphData.Max_Average_Response_Time_ms } }]
      },
      {
        metricName: "Max Calls per Minute",
        dataPoints: [{ metricValue: { value: entityStatsGraphData.Max_Calls_Per_Minute } }]
      },
      {
        metricName: "Max Errors per Minute",
        dataPoints: [{ metricValue: { value: entityStatsGraphData.Max_Errors_Per_Minute } }]
      },
      {
        metricName: "Max Number of Slow Calls",
        dataPoints: [{ metricValue: { value: entityStatsGraphData.Max_Num_Of_Slow_Calls } }]
      },
      {
        metricName: "Max Number of Very Slow Calls",
        dataPoints: [{ metricValue: { value: entityStatsGraphData.Max_Num_Of_Very_Slow_Calls } }]
      },
      {
        metricName: "Max Exceptions per Minute",
        dataPoints: [{ metricValue: { value: exceptionsPerMinute.Max_Exceptions_Per_Minute } }]
      }
    ];

    res.json(combinedMetrics);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Failed to fetch metrics data' });
  }
});

// Workload search endpoint
app.post('/api/workload/search', async (req, res) => {
  try {
    const { query, dataStream, username, password, start, end, namespace } = req.body;
    
    // Validate required fields
    if (!query || !dataStream || !username || !password || !start || !end || !namespace) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required parameters',
        timestamp: new Date().toISOString()
      });
    }

    // Validate query length
    if (query.length < 2) {
      return res.json({ 
        success: true,
        searchResults: [],
        message: 'Search term must be at least 2 characters long',
        timestamp: new Date().toISOString()
      });
    }

    // Construct Grafana API URL
    const grafanaUrl = dataStream === 'odc' 
      ? 'https://grafana.kubeodc-test.corp.intranet/api/datasources/proxy/1/api/v1/series'
      : 'https://grafana.kubemdc-test.corp.intranet/api/datasources/proxy/1/api/v1/series';

    // Construct the query parameter
    const encodedQuery = encodeURIComponent(`namespace_workload_pod:kube_pod_owner:relabel{cluster="", namespace="${namespace}"}`);
    const url = `${grafanaUrl}?match[]=${encodedQuery}&start=${start}&end=${end}`;

    // Make request to Grafana API
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
        'Content-Type': 'application/json'
      },
      agent: httpsAgent // Use the custom agent that ignores certificate errors
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || `Grafana API error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform Grafana response to our format
    const workloads = data.data
      .filter(item => item.workload)
      .map(item => ({
        workload: item.workload,
        namespace: item.namespace,
        id: item.pod,
        type: item.workload_type
      }));

    // Filter by query
    const filteredWorkloads = workloads.filter(workload => 
      workload.workload.toLowerCase().includes(query.toLowerCase())
    );

    res.json({ 
      success: true,
      searchResults: filteredWorkloads,
      query: query,
      totalResults: filteredWorkloads.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error searching workloads:', error);
    // Return mock data on error
    return res.status(200).json({
      success: true,
      searchResults: [
        {
          workload: "bmp-billing-otc-process-test1",
          namespace: "bmsc-test",
          id: "bmp-billing-otc-process-test1-588b7bb8d8-8c5jp",
          type: "deployment"
        },
        {
          workload: "bmp-billing-otc-process-test2",
          namespace: "bmsc-test",
          id: "bmp-billing-otc-process-test2-6d9b494fcd-9hzzb",
          type: "deployment"
        },
        {
          workload: "bmp-catalog-bs-bmpet1",
          namespace: "bmsc-test",
          id: "bmp-catalog-bs-bmpet1-56f569f66f-n9mzn",
          type: "deployment"
        }
      ],
      query: req.body.query,
      totalResults: 3,
      timestamp: new Date().toISOString()
    });
  }
});

// Endpoint to fetch CPU usage metrics
app.get('/api/grafana/metrics/cpu-usage', async (req, res) => {
  try {
    const { namespace, workload, start, end } = req.query;
    
    // Validate required fields
    if (!namespace || !workload || !start || !end) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required parameters',
        timestamp: new Date().toISOString()
      });
    }

    const username = req.headers.username;
    const password = req.headers.password;
    const dataStream = req.headers.datastream;

    if (!username || !password || !dataStream) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing authentication headers',
        timestamp: new Date().toISOString()
      });
    }

    // Construct the query for CPU usage
    const query = encodeURIComponent(`sum(
      node_namespace_pod_container:container_cpu_usage_seconds_total:sum_rate{cluster="", namespace="${namespace}"}
    * on(namespace,pod)
      group_left(workload, workload_type) namespace_workload_pod:kube_pod_owner:relabel{cluster="", namespace="${namespace}", workload="${workload}", workload_type="deployment"}
    ) by (pod)`);

    // Construct Grafana API URL
    const grafanaUrl = dataStream === 'odc' 
      ? 'https://grafana.kubeodc-test.corp.intranet/api/datasources/proxy/1/api/v1/query_range'
      : 'https://grafana.kubemdc-test.corp.intranet/api/datasources/proxy/1/api/v1/query_range';

    const url = `${grafanaUrl}?query=${query}&start=${start}&end=${end}&step=60`;

    // Make request to Grafana API with the custom https agent
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
        'Content-Type': 'application/json'
      },
      agent: httpsAgent // Use the custom agent that ignores certificate errors
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || `Grafana API error! status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
    
  } catch (error) {
    console.error('Error fetching CPU usage metrics:', error);
    
    // Return mock data on error
    return res.status(200).json({
      status: "success",
      data: {
        resultType: "matrix",
        result: [
          {
            metric: {
              pod: "bmp-service-availability-business-service-test1-7855f8cf69zr2jd"
            },
            values: [
              [1743658200, "0.022022879288413552"],
              [1743658260, "0.017557985708626742"],
              [1743658320, "0.018294102393176317"],
              [1743658380, "0.019125463789234567"],
              [1743658440, "0.021876543210987654"],
              [1743658500, "0.020765432109876543"]
            ]
          }
        ]
      }
    });
  }
});

// Endpoint to fetch CPU requests metrics
app.get('/api/grafana/metrics/cpu-requests', async (req, res) => {
  try {
    const { namespace, workload, time } = req.query;
    
    // Validate required fields
    if (!namespace || !workload || !time) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required parameters',
        timestamp: new Date().toISOString()
      });
    }

    const username = req.headers.username;
    const password = req.headers.password;
    const dataStream = req.headers.datastream;

    if (!username || !password || !dataStream) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing authentication headers',
        timestamp: new Date().toISOString()
      });
    }

    // Construct the query for CPU requests
    const query = encodeURIComponent(`sum(
      kube_pod_container_resource_requests_cpu_cores{cluster="", namespace="${namespace}"}
    * on(namespace,pod)
      group_left(workload, workload_type) namespace_workload_pod:kube_pod_owner:relabel{cluster="", namespace="${namespace}", workload="${workload}", workload_type="deployment"}
    ) by (pod)`);

    // Construct Grafana API URL
    const grafanaUrl = dataStream === 'odc' 
      ? 'https://grafana.kubeodc-test.corp.intranet/api/datasources/proxy/1/api/v1/query'
      : 'https://grafana.kubemdc-test.corp.intranet/api/datasources/proxy/1/api/v1/query';

    const url = `${grafanaUrl}?query=${query}&time=${time}`;

    // Make request to Grafana API with the custom https agent
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
        'Content-Type': 'application/json'
      },
      agent: httpsAgent // Use the custom agent that ignores certificate errors
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || `Grafana API error! status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
    
  } catch (error) {
    console.error('Error fetching CPU requests metrics:', error);
    
    // Return mock data on error
    return res.status(200).json({
      status: "success",
      data: {
        resultType: "vector",
        result: [
          // {
          //   metric: {
          //     pod: "bmp-service-availability-business-service-test1-7855f8cf69zr2jd"
          //   },
          //   value: [
          //     1743665399,
          //     "0.5"
          //   ]
          // }
        ]
      }
    });
  }
});

// Endpoint to fetch Memory usage metrics
app.get('/api/grafana/metrics/memory-usage', async (req, res) => {
  try {
    const { namespace, workload, start, end } = req.query;
    
    // Validate required fields
    if (!namespace || !workload || !start || !end) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required parameters',
        timestamp: new Date().toISOString()
      });
    }

    const username = req.headers.username;
    const password = req.headers.password;
    const dataStream = req.headers.datastream;

    if (!username || !password || !dataStream) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing authentication headers',
        timestamp: new Date().toISOString()
      });
    }

    // Construct the query for Memory usage
    const query = encodeURIComponent(`sum(
      container_memory_working_set_bytes{cluster="", namespace="${namespace}", container!="", image!=""}
    * on(namespace,pod)
      group_left(workload, workload_type) namespace_workload_pod:kube_pod_owner:relabel{cluster="", namespace="${namespace}", workload="${workload}", workload_type="deployment"}
    ) by (pod)`);

    // Construct Grafana API URL
    const grafanaUrl = dataStream === 'odc' 
      ? 'https://grafana.kubeodc-test.corp.intranet/api/datasources/proxy/1/api/v1/query_range'
      : 'https://grafana.kubemdc-test.corp.intranet/api/datasources/proxy/1/api/v1/query_range';

    const url = `${grafanaUrl}?query=${query}&start=${start}&end=${end}&step=60`;

    // Make request to Grafana API with the custom https agent
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
        'Content-Type': 'application/json'
      },
      agent: httpsAgent // Use the custom agent that ignores certificate errors
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || `Grafana API error! status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
    
  } catch (error) {
    console.error('Error fetching Memory usage metrics:', error);
    
    // Return mock data on error
    return res.status(200).json({
      status: "success",
      data: {
        resultType: "matrix",
        result: [
          {
            metric: {
              pod: "bmp-service-availability-business-service-test1-7855f8cf69zr2jd"
            },
            values: [
              [1743658200, "3734126592"],
              [1743658260, "3734126592"],
              [1743658320, "3734126592"],
              [1743658380, "3734167552"],
              [1743658440, "3734175744"],
              [1743658500, "3734150000"]
            ]
          }
        ]
      }
    });
  }
});

// Endpoint to fetch Memory limit metrics
app.get('/api/grafana/metrics/memory-limit', async (req, res) => {
  try {
    const { namespace, workload, time } = req.query;
    
    // Validate required fields
    if (!namespace || !workload || !time) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required parameters',
        timestamp: new Date().toISOString()
      });
    }

    const username = req.headers.username;
    const password = req.headers.password;
    const dataStream = req.headers.datastream;

    if (!username || !password || !dataStream) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing authentication headers',
        timestamp: new Date().toISOString()
      });
    }

    // Construct the query for Memory limit
    const query = encodeURIComponent(`sum(
      kube_pod_container_resource_limits_memory_bytes{cluster="", namespace="${namespace}"}
    * on(namespace,pod)
      group_left(workload, workload_type) namespace_workload_pod:kube_pod_owner:relabel{cluster="", namespace="${namespace}", workload="${workload}", workload_type="deployment"}
    ) by (pod)`);

    // Construct Grafana API URL
    const grafanaUrl = dataStream === 'odc' 
      ? 'https://grafana.kubeodc-test.corp.intranet/api/datasources/proxy/1/api/v1/query'
      : 'https://grafana.kubemdc-test.corp.intranet/api/datasources/proxy/1/api/v1/query';

    const url = `${grafanaUrl}?query=${query}&time=${time}`;

    // Make request to Grafana API with the custom https agent
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
        'Content-Type': 'application/json'
      },
      agent: httpsAgent // Use the custom agent that ignores certificate errors
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error || `Grafana API error! status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
    
  } catch (error) {
    console.error('Error fetching Memory limit metrics:', error);
    
    // Return mock data on error
    return res.status(200).json({
      status: "success",
      data: {
        resultType: "vector",
        result: [
          {
            metric: {
              pod: "bmp-service-availability-business-service-test1-7855f8cf69zr2jd"
            },
            value: [
              1743665399,
              "5368709120"
            ]
          }
        ]
      }
    });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});