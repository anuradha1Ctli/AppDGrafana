// Configuration
const CONFIG = {
  API_BASE_URL: 'https://centurylink-nonprod.saas.appdynamics.com/controller',
  DEFAULT_PAGE_SIZE: 10,
  METRICS: {
    // JVM Metrics
    JVM_HEAP_USAGE: 'JVM|Memory:Heap|Current Usage (MB)',
    JVM_HEAP_MAX: 'JVM|Memory:Heap|Max Available (MB)',
    JVM_HEAP_COMMITTED: 'JVM|Memory:Heap|Committed (MB)',
    JVM_HEAP_USED_PCT: 'JVM|Memory:Heap|Used %',
    JVM_GC_TIME: 'JVM|Garbage Collection|GC Time Spent Per Min (ms)',
    JVM_CPU_USAGE: 'JVM|Process CPU Usage %',
    JVM_THREAD_COUNT: 'JVM|Threads|Current No. of Threads',

    // Entity Stats Graph Data Metrics
    MAX_AVG_RESPONSE_TIME: 'Max Average Response Time (ms)',
    MAX_CALLS_PER_MINUTE: 'Max Calls per Minute',
    MAX_ERRORS_PER_MINUTE: 'Max Errors per Minute',
    MAX_SLOW_CALLS: 'Max Number of Slow Calls',
    MAX_VERY_SLOW_CALLS: 'Max Number of Very Slow Calls',
    MAX_EXCEPTIONS_PER_MINUTE: 'Max Exceptions per Minute'
  }
};

const JAVA_GAUGES_METRICS = [
  'JVM|Memory:Heap|Current Usage (MB)',
  'JVM|Memory:Heap|Max Available (MB)',
  'JVM|Memory:Heap|Committed (MB)',
  'JVM|Memory:Heap|Used %',
  'JVM|Garbage Collection|GC Time Spent Per Min (ms)',
  'JVM|Process CPU Usage %',
  'JVM|Threads|Current No. of Threads'
];

// State management
const state = {
  selectedAppDynamicsApplicationId: null,
  selectedAppDynamicsNodeId: null,
  selectedAppDynamicsComponentId: null,
  selectedTierName: null,
  selectedNodeName: null
};

// UI Elements
const UI = {
  init() {
    this.errorAlert = document.getElementById('errorAlert');
    this.errorMessage = document.getElementById('errorMessage');
    this.progressLine = document.getElementById('progressLine');
    this.metricsGrid = document.getElementById('metricsGrid');
    this.fetchButton = document.getElementById('fetchButton');
    this.downloadButton = document.getElementById('downloadButton');
    this.applicationInput = document.getElementById('applicationInput');
    this.serviceInput = document.getElementById('serviceInput');
    this.applicationResults = document.getElementById('applicationResults');
    this.serviceResults = document.getElementById('serviceResults');
    this.namespaceInput = document.getElementById('namespaceInput');
    this.namespaceResults = document.getElementById('namespaceResults');
    this.workloadInput = document.getElementById('workloadInput');
    this.workloadResults = document.getElementById('workloadResults');
  },

  showError(message) {
    this.errorMessage.textContent = message;
    this.errorAlert.classList.add('show');
  },

  hideError() {
    this.errorAlert.classList.remove('show');
  },

  showProgress() {
    this.progressLine.classList.add('show');
    this.fetchButton.disabled = true;
    this.downloadButton.disabled = true;
  },

  hideProgress() {
    this.progressLine.classList.remove('show');
    this.fetchButton.disabled = false;
    this.downloadButton.disabled = false;
  }
};

// Authentication Module
async function getAuthConfig() {
  const response = await fetch('/api/auth');
  const config = await response.json();
  return config;
}
const Auth = {
  async getAuthorizationHeader() {
    const config = await getAuthConfig();
    const dataSource = document.getElementById('datasource').value;

    if (dataSource === 'appd') {
      console.log('AppDynamics token:', config.token);
      return 'config.token';
    } else if (dataSource === 'grafana') {
      return 'Basic ' + btoa(`${config.username}:${config.password}`);
    }
    return '';
  },

  setupAuthenticationToggle() {
    const authFields = document.querySelectorAll('.auth-fields');
    const datasourceSelect = document.getElementById('datasource');
    const grafanaDataSource = document.getElementById('grafanaDataSource');

    // Function to update auth visibility based on data source
    const updateAuthVisibility = (dataSource) => {
      const tokenAuth = document.getElementById('tokenAuth');
      const credentialsAuth = document.getElementById('credentialsAuth');
      
      if (dataSource === 'appd') {
        credentialsAuth.classList.remove('active');
        document.getElementById('namespaceResults').classList.add('hidden');
      } else if (dataSource === 'grafana') {
        credentialsAuth.classList.add('active');
        grafanaDataSource.classList.remove('hidden');
        document.querySelector('.namespace-container').classList.remove('hidden');
      }
    };

    // Initialize auth visibility based on current data source
    updateAuthVisibility(datasourceSelect.value);

    // Update auth visibility when data source changes
    datasourceSelect.addEventListener('change', (e) => {
      updateAuthVisibility(e.target.value);
    });

    // Clear Namespace and Workload inputs when DataStream radio buttons are toggled
    const clearInputs = () => {
      UI.namespaceInput.value = '';
      UI.workloadInput.value = '';
    };

    // Add event listener for DataStream radio buttons
    const dataStreamRadios = document.querySelectorAll('input[name="dataStream"]');
    dataStreamRadios.forEach(radio => {
      radio.addEventListener('change', clearInputs);
    });
  }
};

// Date Time Module
const DateTime = {
  init() {
    const now = new Date();
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);

    this.setDateTimeInputs(oneWeekAgo, now);
  },

  setDateTimeInputs(startDate, endDate) {
    document.getElementById('startDate').value = this.formatDate(startDate);
    document.getElementById('startTime').value = this.formatTime(startDate);
    document.getElementById('endDate').value = this.formatDate(endDate);
    document.getElementById('endTime').value = this.formatTime(endDate);
  },

  formatDate(date) {
    return date.toISOString().split('T')[0];
  },

  formatTime(date) {
    return date.toTimeString().split(' ')[0];
  },

  getDateTimeRange() {
    const startDate = document.getElementById('startDate').value;
    const startTime = document.getElementById('startTime').value;
    const endDate = document.getElementById('endDate').value;
    const endTime = document.getElementById('endTime').value;

    return {
      start: new Date(`${startDate}T${startTime}`),
      end: new Date(`${endDate}T${endTime}`)
    };
  }
};

// Validation Module
const Validation = {
  validateInputs() {
    const dateRange = DateTime.getDateTimeRange();
    if (!dateRange.start || !dateRange.end) {
      UI.showError('Please select both start and end dates/times');
      return false;
    }

    // Check if DataStream is selected when using Grafana
    
      const selectedDataStream = document.querySelector('input[name="dataStream"]:checked');
      if (!selectedDataStream) {
        UI.showError('Please select a data stream (ODC or MDC)');
        return false;
      }

    if (!state.selectedAppDynamicsApplicationId || !state.selectedAppDynamicsNodeId) {
      UI.showError('Please select both an application and a service');
      return false;
    }

    return true;
  }
};

// Metrics Module
async function loadEnvVariables() {
  try {
    const response = await fetch('/api/env');
    if (!response.ok) {
      throw new Error(`Failed to load environment variables: ${response.status}`);
    }
    const env = await response.json();
    console.log('Loaded environment variables:', env);
    return env;
  } catch (error) {
    console.error('Error loading environment variables:', error);
    throw error;
  }
}

async function getAuthDetails() {
  try {
    const response = await fetch('/api/auth');
    if (!response.ok) {
      throw new Error(`Failed to fetch auth details: ${response.status}`);
    }
    const authDetails = await response.json();
    console.log('Fetched auth details:', { ...authDetails, password: '***' }); // Mask password in logs
    return authDetails;
  } catch (error) {
    console.error('Error fetching auth details:', error);
    throw error;
  }
}

const Metrics = {
  lastFetchedMetricsData: null,

  // Display Grafana-specific metrics in the metrics grid
  displayGrafanaMetrics() {
    const metricsGrid = document.getElementById('metricsGrid');
    
    // Clear existing metrics
    metricsGrid.innerHTML = '';
    
    // Define Grafana metrics
    const grafanaMetrics = [
      { name: 'CPU Usage', id: 'cpu-usage', unit: '%' },
      { name: 'CPU Requests', id: 'cpu-requests', unit: 'cores' },
      { name: 'Memory Usage', id: 'memory-usage', unit: 'GiB' },
      { name: 'Memory Limit', id: 'memory-limit', unit: 'GiB' }
    ];
    
    // Create metric cards
    grafanaMetrics.forEach(metric => {
      const metricCard = document.createElement('div');
      metricCard.className = 'bg-white p-4 rounded-lg shadow-sm border border-gray-200';
      metricCard.innerHTML = `
        <div class="font-medium text-gray-700 mb-2">${metric.name}</div>
        <div class="text-2xl font-semibold text-gray-900" id="${metric.id}-value">-</div>
        <div class="text-sm text-gray-500">${metric.unit}</div>
      `;
      metricsGrid.appendChild(metricCard);
    });
  },

  // Fetch CPU usage metrics from Grafana
  async fetchGrafanaCpuUsageMetrics(namespace, workload) {
    try {
      UI.showProgress();

      // Load environment variables
      const env = await loadEnvVariables();
      const authDetails = await getAuthDetails(); // Fetch auth details from the backend
      const username = authDetails.username;
      const password = authDetails.password;
      const dataStream = document.querySelector('input[name="dataStream"]:checked').value;
      console.log('Fetched auth details:', { ...authDetails, password: '***' }); // Mask password in logs
      if (!username || !password) {
        throw new Error('Username and password are required');
      }

      // Get date/time range
      const dateRange = DateTime.getDateTimeRange();
      if (!dateRange) {
        throw new Error('Please select valid start and end date/time');
      }

      // Construct the URL with query parameters
      const params = new URLSearchParams({
        namespace: namespace,
        workload: workload,
        start: Math.floor(dateRange.start.getTime() / 1000), // Convert to seconds
        end: Math.floor(dateRange.end.getTime() / 1000)      // Convert to seconds
      });

      const response = await fetch(`/api/grafana/metrics/cpu-usage?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Username': username,
          'Password': password,
          'DataStream': dataStream
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return this.extractMaxCpuUsage(data);
    } catch (error) {
      console.error('Error fetching Grafana CPU usage metrics:', error);
      UI.showError('Error fetching CPU usage: ' + error.message);
      throw error;
    } finally {
      UI.hideProgress();
    }
  },

  // Extract the maximum CPU usage value from the response
  extractMaxCpuUsage(data) {
    if (!data || !data.data || !data.data.result || !data.data.result[0] || !data.data.result[0].values) {
      throw new Error('Invalid response format');
    }

    // Get all CPU usage values
    const values = data.data.result[0].values.map(item => parseFloat(item[1]));
    
    // Find the maximum value
    const maxValue = Math.max(...values);
    
    // Convert to percentage (multiply by 100)
    return (maxValue * 100).toFixed(2);
  },

  // Fetch CPU requests metrics from Grafana
  async fetchGrafanaCpuRequestsMetrics(namespace, workload) {
    try {
      UI.showProgress();

      // Get date/time range
      const dateRange = DateTime.getDateTimeRange();
      if (!dateRange) {
        throw new Error('Please select valid start and end date/time');
      }

      // Get authentication
      const authDetails = await getAuthDetails(); // Fetch auth details from the backend
      const username = authDetails.username;
      const password = authDetails.password;
      const dataStream = document.querySelector('input[name="dataStream"]:checked').value;

      if (!username || !password) {
        throw new Error('Username and password are required');
      }

      // Construct the URL with query parameters - use end time for the query
      const params = new URLSearchParams({
        namespace: namespace,
        workload: workload,
        time: Math.floor(dateRange.end.getTime() / 1000) // Convert to seconds
      });

      const response = await fetch(`/api/grafana/metrics/cpu-requests?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Username': username,
          'Password': password,
          'DataStream': dataStream
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return this.extractCpuRequestsValue(data);
    } catch (error) {
      console.error('Error fetching Grafana CPU requests metrics:', error);
      UI.showError('Error fetching CPU requests: ' + error.message);
      throw error;
    } finally {
      UI.hideProgress();
    }
  },

  // Extract the CPU requests value from the response
  extractCpuRequestsValue(data) {
    if (!data || !data.data || !data.data.result) {
      throw new Error('Data not found');
    }
    if(data.data.result.length === 0) {
      return '0';
    }

    // Get the CPU requests value
    const cpuRequests = parseFloat(data.data.result[0].value[1]);
    
    
    return (cpuRequests);
  },

  // Fetch Memory usage metrics from Grafana
  async fetchGrafanaMemoryUsageMetrics(namespace, workload) {
    try {
      UI.showProgress();

      // Get date/time range
      const dateRange = DateTime.getDateTimeRange();
      if (!dateRange) {
        throw new Error('Please select valid start and end date/time');
      }

      // Get authentication
      const authDetails = await getAuthDetails(); // Fetch auth details from the backend
      const username = authDetails.username;
      const password = authDetails.password;
      const dataStream = document.querySelector('input[name="dataStream"]:checked').value;

      if (!username || !password) {
        throw new Error('Username and password are required');
      }

      // Construct the URL with query parameters
      const params = new URLSearchParams({
        namespace: namespace,
        workload: workload,
        start: Math.floor(dateRange.start.getTime() / 1000), // Convert to seconds
        end: Math.floor(dateRange.end.getTime() / 1000)      // Convert to seconds
      });

      const response = await fetch(`/api/grafana/metrics/memory-usage?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Username': username,
          'Password': password,
          'DataStream': dataStream
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return this.extractMaxMemoryUsage(data);
    } catch (error) {
      console.error('Error fetching Grafana Memory usage metrics:', error);
      UI.showError('Error fetching Memory usage: ' + error.message);
      throw error;
    } finally {
      UI.hideProgress();
    }
  },

  // Extract the maximum Memory usage value from the response
  extractMaxMemoryUsage(data) {
    if (!data || !data.data || !data.data.result || !data.data.result[0] || !data.data.result[0].values) {
      throw new Error('Invalid response format');
    }

    // Get all Memory usage values
    const values = data.data.result[0].values.map(item => parseFloat(item[1]));
    
    // Find the maximum value
    const maxValue = Math.max(...values);
    
    // Convert to MiB (divide by 1024^2)
    return (maxValue / (1024 * 1024 *1024)).toFixed(2);
  },

  // Fetch Memory limit metrics from Grafana
  async fetchGrafanaMemoryLimitMetrics(namespace, workload) {
    try {
      UI.showProgress();

      // Get date/time range
      const dateRange = DateTime.getDateTimeRange();
      if (!dateRange) {
        throw new Error('Please select valid start and end date/time');
      }

      // Get authentication
      const authDetails = await getAuthDetails(); // Fetch auth details from the backend
      const username = authDetails.username;
      const password = authDetails.password;
      const dataStream = document.querySelector('input[name="dataStream"]:checked').value;

      if (!username || !password) {
        throw new Error('Username and password are required');
      }

      // Construct the URL with query parameters - use end time for the query
      const params = new URLSearchParams({
        namespace: namespace,
        workload: workload,
        time: Math.floor(dateRange.end.getTime() / 1000) // Convert to seconds
      });

      const response = await fetch(`/api/grafana/metrics/memory-limit?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Username': username,
          'Password': password,
          'DataStream': dataStream
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return this.extractMemoryLimitValue(data);
    } catch (error) {
      console.error('Error fetching Grafana Memory limit metrics:', error);
      UI.showError('Error fetching Memory limit: ' + error.message);
      throw error;
    } finally {
      UI.hideProgress();
    }
  },

  // Extract the Memory limit value from the response
  extractMemoryLimitValue(data) {
    if (!data || !data.data || !data.data.result || !data.data.result[0] || !data.data.result[0].value) {
      throw new Error('Invalid response format');
    }

    // Get the Memory limit value
    const memoryLimit = parseFloat(data.data.result[0].value[1]);
    
    // Convert to MiB (divide by 1024^2)
    return (memoryLimit / (1024 * 1024 *1024)).toFixed(2);
  },

  async fetchMetricsByServiceName() {
    if (!Validation.validateInputs()) {
      console.warn("Validation failed for inputs.");
      return;
    }

    const dateRange = DateTime.getDateTimeRange();
    console.log("Date range selected:", dateRange);

    UI.showProgress();

    // Disable fetch button during API call
    const fetchButton = document.getElementById('fetchButton');
    fetchButton.disabled = true;
    fetchButton.classList.add('opacity-50', 'cursor-not-allowed');

    try {
      const dataSource = document.getElementById('datasource').value;
      console.log("Selected data source:", dataSource);

      if (dataSource === 'appd') {
        console.log("Fetching metrics from AppDynamics...");
        
        // Prepare the request payload
        const payload = {
          applicationId: state.selectedAppDynamicsApplicationId,
          nodeId: state.selectedAppDynamicsNodeId,
          componentId: state.selectedAppDynamicsComponentId,
          startDateTime: dateRange.start.getTime(),
          endDateTime: dateRange.end.getTime()
        };
        console.log("Request payload:", payload);

        const response = await fetch('/api/metrics/byservicename', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': await Auth.getAuthorizationHeader()
          },
          body: JSON.stringify(payload)
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response from server:", errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched metrics data:", data);

        this.lastFetchedMetricsData = data;

        // Update the UI with the fetched metrics
        this.updateMetricsDisplay(data);
      } else {
        console.warn("Unsupported data source:", dataSource);
      }
    } catch (error) {
      console.error("Error fetching metrics:", error);
      UI.showError("Failed to fetch metrics data: " + error.message);
    } finally {
      // Re-enable fetch button
      fetchButton.disabled = false;
      fetchButton.classList.remove('opacity-50', 'cursor-not-allowed');
      UI.hideProgress();
    }
  },

  async downloadAppDynamicsMetrics() {
    if (!this.lastFetchedMetricsData || this.lastFetchedMetricsData.length === 0) {
      UI.showError('No metrics data available to download.');
      return;
    }

    // Prepare CSV content
    let csvContent = 'Metric Name,Value,Unit\n';

    // Convert metrics to CSV rows
    this.lastFetchedMetricsData.forEach(metric => {
      const metricName = this.formatMetricName(metric.metricName);
      const unit = this.getMetricUnit(metric.metricName);
      const value = this.getValue(metric.dataPoints, metric.metricName);
      const displayValue = this.formatMetricValue(value, unit);
      csvContent += `${metricName},${displayValue},${unit}\n`;
    });

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    // Generate filename with current timestamp
    const timestamp = new Date().toISOString().replace(/[:\.]/g, '-');
    const filename = `appd_metrics_${timestamp}.csv`;

    if (navigator.msSaveBlob) { // For IE 10+
      navigator.msSaveBlob(blob, filename);
    } else {
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  },

  async downloadGrafanaMetrics() {
    // Get the metrics values
    const cpuUsage = document.getElementById('cpu-usage-value').textContent;
    const cpuRequests = document.getElementById('cpu-requests-value').textContent;
    const memoryUsage = document.getElementById('memory-usage-value').textContent;
    const memoryLimit = document.getElementById('memory-limit-value').textContent;

    // Prepare CSV content
    let csvContent = 'Metric Name,Value,Unit\n';
    csvContent += `CPU Usage,${cpuUsage},%\n`;
    csvContent += `CPU Requests,${cpuRequests},count\n`;
    csvContent += `Memory Usage,${memoryUsage},Mi\n`;
    csvContent += `Memory Limit,${memoryLimit},Mi\n`;

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    // Generate filename with current timestamp
    const timestamp = new Date().toISOString().replace(/[:\.]/g, '-');
    const filename = `grafana_metrics_${timestamp}.csv`;

    if (navigator.msSaveBlob) { // For IE 10+
      navigator.msSaveBlob(blob, filename);
    } else {
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  },

  downloadMetrics() {
    const dataSource = document.getElementById('datasource').value;
  
    try {
      if (dataSource === 'appd') {
        this.downloadAppDynamicsMetrics();
      } else if (dataSource === 'grafana') {
        this.downloadGrafanaMetrics();
      }
    } catch (error) {
      console.error('Error downloading metrics:', error);
      UI.showError('Error downloading metrics: ' + error.message);
    }
  },

  updateMetricsDisplay(metricsData) {
    if (!metricsData || !Array.isArray(metricsData)) {
      UI.metricsGrid.innerHTML = '<div class="col-span-full text-center text-gray-500">No metrics data available</div>';
      return;
    }

    // Separate Java Gauges and other metrics
    const javaGauges = [];
    const otherMetrics = [];
    metricsData.forEach(metric => {
      if (JAVA_GAUGES_METRICS.includes(metric.metricName)) {
        javaGauges.push(metric);
      } else {
        otherMetrics.push(metric);
      }
    });

    // Render other metrics first
    let metricsHtml = otherMetrics.map(metric => {
      const metricName = this.formatMetricName(metric.metricName);
      const unit = this.getMetricUnit(metric.metricName);
      const value = this.getValue(metric.dataPoints, metric.metricName);
      const displayValue = this.formatMetricValue(value, unit);

      return `
        <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div class="font-medium text-gray-700 mb-2">${metricName}</div>
          <div class="text-2xl font-semibold text-gray-900">${displayValue}</div>
          <div class="text-sm text-gray-500">${unit}</div>
        </div>
      `;
    }).join('');

    // Render Java Gauges section at the bottom if present
    if (javaGauges.length > 0) {
      metricsHtml += `
  <div class="col-span-full font-semibold text-md mb-2 text-gray-800">Java Gauges</div>
`;
      metricsHtml += javaGauges.map(metric => {
        const metricName = this.formatMetricName(metric.metricName);
        const unit = this.getMetricUnit(metric.metricName);
        const value = this.getValue(metric.dataPoints, metric.metricName);
        const displayValue = this.formatMetricValue(value, unit);

        return `
          <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div class="font-medium text-gray-700 mb-2">${metricName}</div>
            <div class="text-2xl font-semibold text-gray-900">${displayValue}</div>
            <div class="text-sm text-gray-500">${unit}</div>
          </div>
        `;
      }).join('');
    }

    UI.metricsGrid.innerHTML = metricsHtml;
  },

  getValue(dataPoints, metricName) {
    // If no data points, return 0
    if (!dataPoints || !Array.isArray(dataPoints) || dataPoints.length === 0) return 0;

    // Special handling for metrics requiring latest value
    const LATEST_VALUE_METRICS_LIST = [
      // JVM Metrics
      'JVM|Memory:Heap|Current Usage (MB)',
      'JVM|Memory:Heap|Used %',
    ];

    if (LATEST_VALUE_METRICS_LIST.includes(metricName)) {
      // Find the latest data point by comparing startTime
      let latestValue = null;
      let latestStartTime = 0;

      dataPoints.forEach(point => {
        if (point.startTime > latestStartTime) {
          latestStartTime = point.startTime;
          latestValue = point.metricValue?.value;
        }
      });

      return latestValue || 0;
    }

    // Default handling: get max value for other metrics
    return dataPoints.reduce((highest, point) => {
      const currentMax = point.metricValue?.max || point.metricValue?.value || 0;
      return currentMax > highest ? currentMax : highest;
    }, 0);
  },

  formatMetricName(metricName) {
    return metricName
      .replace('JVM|', '')
      .split('|')
      .join(' - ')
      .replace(/\([^)]*\)/g, '')
      .trim();
  },

  getMetricUnit(metricName) {
    if (metricName.includes('(MB)')) return 'MB';
    if (metricName.includes('(ms)')) return 'ms';
    if (metricName.includes('%')) return '%';
    return '';
  },

  formatMetricValue(value, unit) {
    if (value === null || value === undefined) return 'No data';
    const formattedValue = Number.isInteger(value) ? value : value.toFixed(2);
    return unit ? `${formattedValue} ${unit}` : formattedValue;
  }
};

// Search Module
const Search = {
  serviceTimeout: null,
  namespaceTimeout: null,

  async searchNamespaces(query) {
    if (!query.trim()) return;
  
    UI.showProgress();
  
    const dataSource = document.getElementById('datasource').value;
    if (dataSource === 'appd') {
      // AppDynamics search logic
      this.searchApplications(query);
    } else {
      // Grafana search logic
      const dataStream = document.querySelector('input[name="dataStream"]:checked').value;
      
      // Get start and end times
      const startDate = document.getElementById('startDate').value;
      const startTime = document.getElementById('startTime').value;
      const endDate = document.getElementById('endDate').value;
      const endTime = document.getElementById('endTime').value;
  
      // Convert to Unix timestamps
      const startTimestamp = new Date(`${startDate}T${startTime}`).getTime() / 1000;
      const endTimestamp = new Date(`${endDate}T${endTime}`).getTime() / 1000;
  
      const env = await loadEnvVariables();
      const authDetails = await getAuthDetails(); // Fetch auth details from the backend
      const username = authDetails.username;
      const password = authDetails.password;;
  
      const payload = {
        query: query,
        dataStream: dataStream,
        username: username,
        password: password,
        start: startTimestamp,
        end: endTimestamp
      };
  
      console.log('Making request with payload:', { ...payload, password: '***' });
      console.log('Payload being sent to /api/namespaces/search:', payload);
      
      try {
        const response = await fetch('/api/namespaces/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
  
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.error || `HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        this.displayNamespaceResults(data.searchResults);
      } catch (error) {
        console.error('Error searching namespaces:', error);
        UI.showError('Failed to search namespaces');
        throw error;
      } finally {
        UI.hideProgress();
      }
    }
  },

  displayNamespaceResults(results) {
    const resultsContainer = document.getElementById('namespaceResults');
    const namespaceInput = document.getElementById('namespaceInput');
    
    if (!results || results.length === 0) {
      resultsContainer.innerHTML = '<div class="p-2 text-gray-500">No namespaces found</div>';
      return;
    }

    resultsContainer.innerHTML = '';
    results.forEach(result => {
      const div = document.createElement('div');
      div.className = 'p-2 hover:bg-gray-100 cursor-pointer transition-colors duration-200';
      div.textContent = result.namespace;
      div.addEventListener('click', () => {
        document.getElementById('namespaceInput').value = result.namespace;
        resultsContainer.classList.add('hidden');
      });
      resultsContainer.appendChild(div);
    });
    resultsContainer.classList.remove('hidden');
  },

  async searchWorkloads(query) {
    try {
      UI.showProgress();
      const datasourceType = document.getElementById('datasource').value;
      
      if (datasourceType !== 'grafana') {
        document.getElementById('workloadResults').classList.add('hidden');
        return;
      }

      const dataStream = document.querySelector('input[name="dataStream"]:checked').value;
      if (!dataStream) {
        throw new Error('Please select a data stream (ODC or MDC)');
      }
      const authDetails = await getAuthDetails();
      const username = authDetails.username;
      const password = authDetails.password;;
      if (!username || !password) {
        throw new Error('Please enter both username and password for Grafana');
      }

      // Get selected namespace
      const namespaceInput = document.getElementById('namespaceInput');
      const namespace = namespaceInput.value;
      if (!namespace) {
        throw new Error('Please select a namespace first');
      }

      // Get start and end times
      const startDate = document.getElementById('startDate').value;
      const startTime = document.getElementById('startTime').value;
      const endDate = document.getElementById('endDate').value;
      const endTime = document.getElementById('endTime').value;

      if (!startDate || !startTime || !endDate || !endTime) {
        throw new Error('Please select both start and end date/time');
      }

      // Convert to Unix timestamps
      const startTimestamp = new Date(`${startDate}T${startTime}`).getTime() / 1000;
      const endTimestamp = new Date(`${endDate}T${endTime}`).getTime() / 1000;

      const payload = {
        query: query,
        dataStream: dataStream, // Use dataStream parameter name to match backend
        username: username,
        password: password,
        start: startTimestamp,
        end: endTimestamp,
        namespace: namespace
      };

      console.log('Making request with payload:', { ...payload, password: '***' });
      
      const response = await fetch('/api/workload/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.displayWorkloadResults(data.searchResults || []);
    } catch (error) {
      console.error('Error searching workloads:', error);
      UI.showError('Error searching workloads: ' + error.message);
      document.getElementById('workloadResults').innerHTML = '<div class="p-2 text-red-500">Error fetching workloads</div>';
    } finally {
      UI.hideProgress();
    }
  },

  displayWorkloadResults(results) {
    const resultsContainer = document.getElementById('workloadResults');
    const workloadInput = document.getElementById('workloadInput');
    
    if (!results || results.length === 0) {
      resultsContainer.innerHTML = '<div class="p-2 text-gray-500">No workloads found</div>';
      return;
    }

    resultsContainer.innerHTML = '';
    results.forEach(result => {
      const div = document.createElement('div');
      div.className = 'p-2 hover:bg-gray-100 cursor-pointer transition-colors duration-200';
      div.textContent = result.workload;
      div.addEventListener('click', async () => {
        workloadInput.value = result.workload;
        resultsContainer.classList.add('hidden');
        
        // Display Grafana metrics when a workload is selected
        const datasource = document.getElementById('datasource').value;
        if (datasource === 'grafana') {
          // Call displayGrafanaMetrics to create the metric cards if they don't exist
          Metrics.displayGrafanaMetrics();
          
          // Initialize with placeholder values
          document.getElementById('cpu-usage-value').textContent = '-';
          document.getElementById('cpu-requests-value').textContent = '-';
          document.getElementById('memory-usage-value').textContent = '-';
          document.getElementById('memory-limit-value').textContent = '-';
          
          try {
            // Get the namespace
            const namespace = document.getElementById('namespaceInput').value;
            
            // Fetch all metrics in parallel using Promise.allSettled
            const [cpuUsageResult, cpuRequestsResult, memoryUsageResult, memoryLimitResult] = await Promise.allSettled([
              Metrics.fetchGrafanaCpuUsageMetrics(namespace, result.workload),
              Metrics.fetchGrafanaCpuRequestsMetrics(namespace, result.workload),
              Metrics.fetchGrafanaMemoryUsageMetrics(namespace, result.workload),
              Metrics.fetchGrafanaMemoryLimitMetrics(namespace, result.workload)
            ]);

            // Update values based on results
            document.getElementById('cpu-usage-value').textContent = 
              cpuUsageResult.status === 'fulfilled' ? cpuUsageResult.value : '-';
            document.getElementById('cpu-requests-value').textContent = 
              cpuRequestsResult.status === 'fulfilled' ? cpuRequestsResult.value : '-';
            document.getElementById('memory-usage-value').textContent = 
              memoryUsageResult.status === 'fulfilled' ? memoryUsageResult.value : '-';
            document.getElementById('memory-limit-value').textContent = 
              memoryLimitResult.status === 'fulfilled' ? memoryLimitResult.value : '-';
          } catch (error) {
            console.error('Error updating metrics:', error);
            // Keep the placeholder values on error
          }
        }
      });
      resultsContainer.appendChild(div);
    });
    resultsContainer.classList.remove('hidden');
  },

  async searchApplications(query) {
    try {
      UI.showProgress();
      const response = await fetch('/api/applications/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': Auth.getAuthorizationHeader()
        },
        body: JSON.stringify({ searchText: query })
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      this.displayApplicationResults(data.searchResults || []);
    } catch (error) {
      UI.showError('Error searching applications: ' + error.message);
      UI.applicationResults.innerHTML = '<div class="p-2 text-red-500">Error fetching applications</div>';
    } finally {
      UI.hideProgress();
    }
  },

  displayApplicationResults(results) {
    // No need for complex filtering as the results are already in the desired format
    if (!results || results.length === 0) {
      UI.applicationResults.innerHTML = '<div class="p-2 text-gray-500">No applications found</div>';
      return;
    }

    UI.applicationResults.innerHTML = results
      .map(result => `
        <div class="application-result-item" 
             data-id="${result.id}" 
             data-name="${result.name}">
          ${result.name}
        </div>
      `)
      .join('');

    UI.applicationResults.classList.remove('hidden');
  },


  async searchServices(query) {
    if (!state.selectedAppDynamicsApplicationId) return;

    const dateRange = DateTime.getDateTimeRange();
    UI.showProgress();
    
    try {
      const response = await fetch('/api/services/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': Auth.getAuthorizationHeader()
        },
        body: JSON.stringify({
          applicationId: state.selectedAppDynamicsApplicationId,
          startDateTime: dateRange.start.getTime(),
          endDateTime: dateRange.end.getTime()
        })
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      
      // Parse and format the services data
      const servicesData = [];
      if (data.data && Array.isArray(data.data)) {
        data.data.forEach(tier => {
          if (tier.children && Array.isArray(tier.children)) {
            tier.children.forEach(node => {
              // If query is empty, show all nodes, otherwise filter by search
              if (!query || node.nodeName.toLowerCase().includes(query.toLowerCase())) {
                servicesData.push({
                  displayText: `${tier.name} - ${node.nodeName}`,
                  nodeId: node.nodeId,
                  componentId: node.componentId,
                  tierName: tier.name,
                  nodeName: node.nodeName
                });
              }
            });
          }
        });
      }

      // Sort services by tier name and node name
      servicesData.sort((a, b) => {
        const tierCompare = a.tierName.localeCompare(b.tierName);
        if (tierCompare !== 0) return tierCompare;
        return a.nodeName.localeCompare(b.nodeName);
      });

      this.displayServiceResults(servicesData);
    } catch (error) {
      UI.showError('Error searching services: ' + error.message);
      UI.serviceResults.innerHTML = '<div class="p-2 text-red-500">Error fetching services</div>';
      UI.serviceResults.classList.remove('hidden');
    } finally {
      UI.hideProgress();
    }
  },

  displayServiceResults(results) {
    if (!results || !results.length) {
      UI.serviceResults.innerHTML = '<div class="p-2 text-gray-500">No services found</div>';
      UI.serviceResults.classList.remove('hidden');
      return;
    }

    UI.serviceResults.innerHTML = results
      .map(result => `
        <div class="application-result-item"
             data-id="${result.nodeId}"
             data-component-id="${result.componentId}"
             data-tier="${result.tierName}"
             data-node="${result.nodeName}">
          ${result.displayText}
        </div>
      `)
      .join('');

    UI.serviceResults.classList.remove('hidden');
  }
};

// Initialize application
function initializeApp() {
  UI.init();
  DateTime.init();
  Auth.setupAuthenticationToggle();
  setupEventListeners();
}

// Event Listeners
function setupEventListeners() {
  // Namespace search
  document.getElementById('namespaceInput').addEventListener('input', debounce(async (e) => {
    const query = e.target.value.trim();
    const dataSource = document.getElementById('datasource').value;
    
    if (query.length > 3) {
      try {
        await Search.searchNamespaces(query);
        // Show results only after successful API call
        document.getElementById('namespaceResults').classList.remove('hidden');
      } catch (error) {
        console.error('Error searching namespaces:', error);
        UI.showError('Failed to search namespaces');
      }
    } else {
      document.getElementById('namespaceResults').classList.add('hidden');
    }
  }, 300));
  
  // Workload search
  document.getElementById('workloadInput').addEventListener('input', debounce((e) => {
    const query = e.target.value.trim();
    if (query.length > 3) {
      Search.searchWorkloads(query);
    } else {
      document.getElementById('workloadResults').classList.add('hidden');
    }
  }, 300));

  

  // Namespace selection
  document.getElementById('namespaceResults').addEventListener('click', (e) => {
    const item = e.target.closest('.p-2');
    if (item) {
      document.getElementById('namespaceInput').value = item.textContent;
      document.getElementById('namespaceResults').classList.add('hidden');
    }
  });

  // Workload selection
  document.getElementById('workloadResults').addEventListener('click', (e) => {
    const item = e.target.closest('.p-2');
    if (item) {
      document.getElementById('workloadInput').value = item.textContent;
      document.getElementById('workloadResults').classList.add('hidden');
    }
  });

  // Data source change
  document.getElementById('datasource').addEventListener('change', (e) => {
    const isGrafana = e.target.value === 'grafana';
    document.getElementById('grafanaDataSource').classList.toggle('hidden', !isGrafana);
    
    // Update metrics grid based on data source
    if (isGrafana) {
      Metrics.displayGrafanaMetrics();
    } else {
      // Clear metrics grid for AppDynamics (will be populated on fetch)
      document.getElementById('metricsGrid').innerHTML = '';
    }
    
    resetForm();
    toggleAppDynamicsControls(e.target.value === 'appd');
  });

  // Click outside handlers
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.namespace-container')) {
      document.getElementById('namespaceResults').classList.add('hidden');
    }
    if (!e.target.closest('.workload-container')) {
      document.getElementById('workloadResults').classList.add('hidden');
    }
  });

  // Application search
  UI.applicationInput.addEventListener('input', debounce((e) => {
    const query = e.target.value.trim();
    if (query) {
      Search.searchApplications(query);
    } else {
      UI.applicationResults.classList.add('hidden');
    }
  }, 300));

  // Service search
  UI.serviceInput.addEventListener('input', debounce((e) => {
    const query = e.target.value.trim();
    if (query) {
      Search.searchServices(query);
    } else {
      UI.serviceResults.classList.add('hidden');
    }
  }, 300));

  // Application selection
  UI.applicationResults.addEventListener('click', (e) => {
    const item = e.target.closest('.application-result-item');
    if (item) {
      state.selectedAppDynamicsApplicationId = item.dataset.id;
      UI.applicationInput.value = item.dataset.name;
      UI.applicationResults.classList.add('hidden');
      UI.serviceInput.disabled = false;
      UI.serviceInput.placeholder = 'Type to search services...';
      state.selectedAppDynamicsNodeId = null;
      state.selectedAppDynamicsComponentId = null;
      UI.serviceInput.value = '';
      
      // Automatically search for services
      Search.searchServices('');
    }
  });

  // Service selection
  UI.serviceResults.addEventListener('click', (e) => {
    const item = e.target.closest('.application-result-item');
    if (item) {
      state.selectedAppDynamicsNodeId = item.dataset.id;
      state.selectedAppDynamicsComponentId = item.dataset.componentId;
      state.selectedTierName = item.dataset.tier;
      state.selectedNodeName = item.dataset.node;
      UI.serviceInput.value = `${item.dataset.tier} - ${item.dataset.node}`;
      UI.serviceResults.classList.add('hidden');

      // Automatically fetch metrics after service selection
      Metrics.fetchMetricsByServiceName();
    }
  });

  // Fetch button
  UI.fetchButton.addEventListener('click', async () => {

    
    // Debug the datasource selection
    const dataSource = document.getElementById('datasource').value;
  
    
    // Check if we're in Grafana mode
    if (dataSource === 'grafana') {
    
      // Get the namespace and workload
      const namespace = document.getElementById('namespaceInput').value.trim();
      const workload = document.getElementById('workloadInput').value.trim();
      console.log('Namespace:', namespace, 'Workload:', workload);
      
      if (!namespace || !workload) {
        UI.showError('Please select both namespace and workload');
        return;
      }
      
      // Show progress and disable button
      UI.showProgress();
      UI.fetchButton.disabled = true;
      
      try {
        // Display metrics grid
        Metrics.displayGrafanaMetrics();

        // Get date/time range
        const dateRange = DateTime.getDateTimeRange();
        console.log('Date range:', dateRange);
        
        // Get authentication
        const authDetails = await loadEnvVariables(); // Fetch auth details from the backend
        const username = authDetails.username;
        const password = authDetails.password;
        const dataStream = document.querySelector('input[name="dataStream"]:checked').value;
        
        if (!username || !password) {
          throw new Error('Username and password are required');
        }
        
        // Manually call each metric function
        const cpuUsage = await Metrics.fetchGrafanaCpuUsageMetrics(namespace, workload);
        console.log('CPU Usage fetched:', cpuUsage);
        
        const cpuRequests = await Metrics.fetchGrafanaCpuRequestsMetrics(namespace, workload);
        console.log('CPU Requests fetched:', cpuRequests);
        
        const memoryUsage = await Metrics.fetchGrafanaMemoryUsageMetrics(namespace, workload);
        console.log('Memory Usage fetched:', memoryUsage);
        
        const memoryLimit = await Metrics.fetchGrafanaMemoryLimitMetrics(namespace, workload);
        console.log('Memory Limit fetched:', memoryLimit);
        
        // Update UI
        document.getElementById('cpu-usage-value').textContent = cpuUsage + '%';
        document.getElementById('cpu-requests-value').textContent = cpuRequests + ' cores';
        document.getElementById('memory-usage-value').textContent = memoryUsage + ' GiB';
        document.getElementById('memory-limit-value').textContent = memoryLimit + ' GiB';
        
        console.log('All metrics updated in UI');
      } catch (error) {
        console.error('Error fetching metrics:', error);
        UI.showError('Failed to fetch metrics: ' + error.message);
      } finally {
        UI.hideProgress();
        UI.fetchButton.disabled = false;
      }
    } else {
      // Use the existing function for AppDynamics
      Metrics.fetchMetricsByServiceName();
    }
  });

  // Download button
  UI.downloadButton.addEventListener('click', () => Metrics.downloadMetrics());

  // Error alert close
  document.addEventListener('click', (e) => {
    if (!UI.errorAlert.contains(e.target)) {
      UI.hideError();
    }
  });
}

// Utility functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function resetForm() {
  state.selectedAppDynamicsApplicationId = null;
  state.selectedAppDynamicsNodeId = null;
  state.selectedAppDynamicsComponentId = null;
  state.selectedTierName = null;
  state.selectedNodeName = null;
  
  UI.applicationInput.value = '';
  UI.serviceInput.value = '';
  UI.serviceInput.disabled = true;
  UI.serviceInput.placeholder = 'Select an application first...';
  UI.metricsGrid.innerHTML = '';
  UI.hideError();
}

function toggleAppDynamicsControls(show) {
  const appdControls = document.getElementById('appdControls');
  appdControls.style.display = show ? 'block' : 'none';
}

// Initialize the application
document.addEventListener('DOMContentLoaded', initializeApp);
