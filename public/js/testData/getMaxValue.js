import fs from 'fs';

function findMaxMetricValue(data, metricName) {
  try {
    if (!data || typeof data !== 'object') {
      return `${metricName}: Invalid data format`;
    }

    const metricData = data[metricName];
    if (!metricData || !metricData.dataTimeslices 
        || !Array.isArray(metricData.dataTimeslices)) {
      return `${metricName}: No data or invalid dataTimeslices`;
    }

    const maxValues = metricData.dataTimeslices.map(
      (timeslice) => timeslice?.metricValue?.value 
    ); 

    const maxValue = maxValues.reduce((acc, value) => {
      if (value !== undefined && !isNaN(value)) {
        acc = Math.max(acc, value);
      }
      return acc;
    }, -Infinity);

    return `${metricName}: ${maxValue}`;
  } catch (error) {
    console.error(`Error processing ${metricName}:`, error);
    return `${metricName}: Error`;
  }
}

// Assuming your JSON data is in a file named 'data.json'
fs.readFile('data.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  try {
    const jsonData = JSON.parse(data);

    const metrics = [
      'averageResponseTimeData',
      'callsPerMinuteData',
      'errorsPerMinuteData',
      'numOfSlowCallsData',
      'numOfVerySlowCallsData',
    ];

    metrics.forEach((metric) => {
      const result = findMaxMetricValue(jsonData, metric);
      console.log(result);
    });

  } catch (error) {
    console.error('Error parsing JSON:', error);
  }
});