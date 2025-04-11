/**
 * Extracts the maximum value from metric data
 * 
 * @param {Object} metricData - The metric data object containing dataTimeslices
 * @param {string} [metricName='Unknown metric'] - Optional name of the metric for logging
 * @returns {number} The maximum value found in the metric data
 */
export function extractMaxValue(metricData, metricName = 'Unknown metric') {
  // Validate input
  if (!metricData || !metricData.dataTimeslices || metricData.dataTimeslices.length === 0) {
    console.log(`No data found for metric: ${metricName}`);
    return 0;
  }

  // Filter and map valid data points
  const validValues = metricData.dataTimeslices
    .filter(slice => 
      slice.metricValue !== null && 
      slice.metricValue !== undefined && 
      typeof slice.metricValue.value === 'number'
    )
    .map(slice => slice.metricValue.value);

  // Handle case where no valid values are found
  if (validValues.length === 0) {
    console.log(`No valid values found for metric: ${metricName}`);
    return 0;
  }

  // Return max value
  const maxValue = Math.max(...validValues);
  console.log(`Max value for ${metricName}: ${maxValue}`);
  return maxValue;
}

// var data = {
//   "averageResponseTimeData": {
//       "metricId": 92106230,
//       "metricName": "BTM|Application Summary|Component:4275719|Average Response Time (ms)",
//       "frequency": "ONE_MIN",
//       "granularityMinutes": 1,
//       "dataTimeslices": [
//           {
//               "startTime": 1737303780000,
//               "metricValue": {
//                   "value": 41,
//                   "min": 7,
//                   "max": 79,
//                   "current": 112,
//                   "sum": 410,
//                   "count": 10,
//                   "useRange": true,
//                   "groupCount": 200,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737303840000,
//               "metricValue": {
//                   "value": 42,
//                   "min": 12,
//                   "max": 63,
//                   "current": 79,
//                   "sum": 416,
//                   "count": 10,
//                   "useRange": true,
//                   "groupCount": 200,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737303900000,
//               "metricValue": {
//                   "value": 43,
//                   "min": 8,
//                   "max": 100,
//                   "current": 75,
//                   "sum": 511,
//                   "count": 12,
//                   "useRange": true,
//                   "groupCount": 200,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737303960000,
//               "metricValue": {
//                   "value": 211,
//                   "min": 34,
//                   "max": 1525,
//                   "current": 87,
//                   "sum": 1896,
//                   "count": 9,
//                   "useRange": true,
//                   "groupCount": 200,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304020000,
//               "metricValue": {
//                   "value": 36,
//                   "min": 13,
//                   "max": 62,
//                   "current": 75,
//                   "sum": 391,
//                   "count": 11,
//                   "useRange": true,
//                   "groupCount": 200,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304080000,
//               "metricValue": {
//                   "value": 33,
//                   "min": 32,
//                   "max": 34,
//                   "current": 32,
//                   "sum": 131,
//                   "count": 4,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304140000,
//               "metricValue": {
//                   "value": 34,
//                   "min": 33,
//                   "max": 36,
//                   "current": 33,
//                   "sum": 137,
//                   "count": 4,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304200000,
//               "metricValue": {
//                   "value": 35,
//                   "min": 32,
//                   "max": 37,
//                   "current": 32,
//                   "sum": 139,
//                   "count": 4,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304260000,
//               "metricValue": {
//                   "value": 34,
//                   "min": 33,
//                   "max": 35,
//                   "current": 34,
//                   "sum": 135,
//                   "count": 4,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304320000,
//               "metricValue": {
//                   "value": 33,
//                   "min": 32,
//                   "max": 36,
//                   "current": 36,
//                   "sum": 133,
//                   "count": 4,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304380000,
//               "metricValue": {
//                   "value": 35,
//                   "min": 32,
//                   "max": 42,
//                   "current": 33,
//                   "sum": 140,
//                   "count": 4,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304440000,
//               "metricValue": {
//                   "value": 25,
//                   "min": 5,
//                   "max": 41,
//                   "current": 39,
//                   "sum": 200,
//                   "count": 8,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304500000,
//               "metricValue": {
//                   "value": 36,
//                   "min": 33,
//                   "max": 42,
//                   "current": 42,
//                   "sum": 143,
//                   "count": 4,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304560000,
//               "metricValue": {
//                   "value": 36,
//                   "min": 31,
//                   "max": 48,
//                   "current": 31,
//                   "sum": 145,
//                   "count": 4,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304620000,
//               "metricValue": {
//                   "value": 26,
//                   "min": 11,
//                   "max": 36,
//                   "current": 33,
//                   "sum": 180,
//                   "count": 7,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304680000,
//               "metricValue": {
//                   "value": 33,
//                   "min": 32,
//                   "max": 34,
//                   "current": 34,
//                   "sum": 133,
//                   "count": 4,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304740000,
//               "metricValue": {
//                   "value": 52,
//                   "min": 34,
//                   "max": 104,
//                   "current": 104,
//                   "sum": 208,
//                   "count": 4,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304800000,
//               "metricValue": {
//                   "value": 34,
//                   "min": 32,
//                   "max": 40,
//                   "current": 32,
//                   "sum": 137,
//                   "count": 4,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304860000,
//               "metricValue": {
//                   "value": 35,
//                   "min": 34,
//                   "max": 36,
//                   "current": 35,
//                   "sum": 140,
//                   "count": 4,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304920000,
//               "metricValue": {
//                   "value": 36,
//                   "min": 33,
//                   "max": 38,
//                   "current": 33,
//                   "sum": 142,
//                   "count": 4,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304980000,
//               "metricValue": {
//                   "value": 36,
//                   "min": 32,
//                   "max": 42,
//                   "current": 42,
//                   "sum": 143,
//                   "count": 4,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305040000,
//               "metricValue": {
//                   "value": 26,
//                   "min": 6,
//                   "max": 39,
//                   "current": 39,
//                   "sum": 204,
//                   "count": 8,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305100000,
//               "metricValue": {
//                   "value": 35,
//                   "min": 32,
//                   "max": 40,
//                   "current": 34,
//                   "sum": 140,
//                   "count": 4,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305160000,
//               "metricValue": {
//                   "value": 38,
//                   "min": 32,
//                   "max": 48,
//                   "current": 38,
//                   "sum": 153,
//                   "count": 4,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305220000,
//               "metricValue": {
//                   "value": 27,
//                   "min": 9,
//                   "max": 36,
//                   "current": 35,
//                   "sum": 190,
//                   "count": 7,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305280000,
//               "metricValue": {
//                   "value": 34,
//                   "min": 32,
//                   "max": 36,
//                   "current": 33,
//                   "sum": 136,
//                   "count": 4,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305340000,
//               "metricValue": {
//                   "value": 33,
//                   "min": 32,
//                   "max": 34,
//                   "current": 33,
//                   "sum": 132,
//                   "count": 4,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305400000,
//               "metricValue": {
//                   "value": 34,
//                   "min": 32,
//                   "max": 35,
//                   "current": 35,
//                   "sum": 135,
//                   "count": 4,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305460000,
//               "metricValue": {
//                   "value": 865,
//                   "min": 33,
//                   "max": 4188,
//                   "current": 33,
//                   "sum": 4327,
//                   "count": 5,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305520000,
//               "metricValue": {
//                   "value": 34,
//                   "min": 32,
//                   "max": 39,
//                   "current": 33,
//                   "sum": 137,
//                   "count": 4,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305580000,
//               "metricValue": {
//                   "value": 38,
//                   "min": 33,
//                   "max": 51,
//                   "current": 51,
//                   "sum": 152,
//                   "count": 4,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305640000,
//               "metricValue": {
//                   "value": 58,
//                   "min": 7,
//                   "max": 297,
//                   "current": 33,
//                   "sum": 466,
//                   "count": 8,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305700000,
//               "metricValue": {
//                   "value": 34,
//                   "min": 31,
//                   "max": 38,
//                   "current": 32,
//                   "sum": 135,
//                   "count": 4,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305760000,
//               "metricValue": {
//                   "value": 34,
//                   "min": 32,
//                   "max": 37,
//                   "current": 33,
//                   "sum": 135,
//                   "count": 4,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305820000,
//               "metricValue": {
//                   "value": 25,
//                   "min": 9,
//                   "max": 35,
//                   "current": 33,
//                   "sum": 175,
//                   "count": 7,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305880000,
//               "metricValue": {
//                   "value": 33,
//                   "min": 32,
//                   "max": 35,
//                   "current": 32,
//                   "sum": 133,
//                   "count": 4,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305940000,
//               "metricValue": {
//                   "value": 37,
//                   "min": 33,
//                   "max": 40,
//                   "current": 33,
//                   "sum": 146,
//                   "count": 4,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306000000,
//               "metricValue": {
//                   "value": 35,
//                   "min": 33,
//                   "max": 37,
//                   "current": 37,
//                   "sum": 140,
//                   "count": 4,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306060000,
//               "metricValue": {
//                   "value": 34,
//                   "min": 33,
//                   "max": 35,
//                   "current": 35,
//                   "sum": 135,
//                   "count": 4,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306120000,
//               "metricValue": {
//                   "value": 34,
//                   "min": 32,
//                   "max": 35,
//                   "current": 35,
//                   "sum": 134,
//                   "count": 4,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306180000,
//               "metricValue": {
//                   "value": 38,
//                   "min": 33,
//                   "max": 47,
//                   "current": 47,
//                   "sum": 153,
//                   "count": 4,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306240000,
//               "metricValue": {
//                   "value": 23,
//                   "min": 6,
//                   "max": 39,
//                   "current": 32,
//                   "sum": 183,
//                   "count": 8,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306300000,
//               "metricValue": {
//                   "value": 60,
//                   "min": 33,
//                   "max": 140,
//                   "current": 33,
//                   "sum": 241,
//                   "count": 4,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306360000,
//               "metricValue": {
//                   "value": 37,
//                   "min": 33,
//                   "max": 45,
//                   "current": 33,
//                   "sum": 149,
//                   "count": 4,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306420000,
//               "metricValue": {
//                   "value": 25,
//                   "min": 9,
//                   "max": 34,
//                   "current": 34,
//                   "sum": 172,
//                   "count": 7,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306480000,
//               "metricValue": {
//                   "value": 34,
//                   "min": 33,
//                   "max": 35,
//                   "current": 35,
//                   "sum": 135,
//                   "count": 4,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306540000,
//               "metricValue": {
//                   "value": 36,
//                   "min": 33,
//                   "max": 41,
//                   "current": 35,
//                   "sum": 143,
//                   "count": 4,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306600000,
//               "metricValue": {
//                   "value": 35,
//                   "min": 32,
//                   "max": 36,
//                   "current": 36,
//                   "sum": 138,
//                   "count": 4,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306660000,
//               "metricValue": {
//                   "value": 37,
//                   "min": 32,
//                   "max": 40,
//                   "current": 38,
//                   "sum": 146,
//                   "count": 4,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306720000,
//               "metricValue": {
//                   "value": 33,
//                   "min": 32,
//                   "max": 35,
//                   "current": 33,
//                   "sum": 133,
//                   "count": 4,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306780000,
//               "metricValue": {
//                   "value": 37,
//                   "min": 33,
//                   "max": 49,
//                   "current": 49,
//                   "sum": 148,
//                   "count": 4,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306840000,
//               "metricValue": {
//                   "value": 25,
//                   "min": 8,
//                   "max": 42,
//                   "current": 33,
//                   "sum": 201,
//                   "count": 8,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306900000,
//               "metricValue": {
//                   "value": 33,
//                   "min": 32,
//                   "max": 36,
//                   "current": 32,
//                   "sum": 132,
//                   "count": 4,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306960000,
//               "metricValue": {
//                   "value": 34,
//                   "min": 32,
//                   "max": 35,
//                   "current": 34,
//                   "sum": 135,
//                   "count": 4,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737307020000,
//               "metricValue": {
//                   "value": 24,
//                   "min": 6,
//                   "max": 35,
//                   "current": 32,
//                   "sum": 169,
//                   "count": 7,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737307080000,
//               "metricValue": {
//                   "value": 34,
//                   "min": 33,
//                   "max": 36,
//                   "current": 33,
//                   "sum": 137,
//                   "count": 4,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737307140000,
//               "metricValue": {
//                   "value": 34,
//                   "min": 33,
//                   "max": 35,
//                   "current": 34,
//                   "sum": 135,
//                   "count": 4,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737307200000,
//               "metricValue": {
//                   "value": 13,
//                   "min": 5,
//                   "max": 35,
//                   "current": 35,
//                   "sum": 215,
//                   "count": 16,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737307260000,
//               "metricValue": {
//                   "value": 35,
//                   "min": 32,
//                   "max": 36,
//                   "current": 36,
//                   "sum": 138,
//                   "count": 4,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737307320000,
//               "metricValue": {
//                   "value": 11,
//                   "min": 2,
//                   "max": 36,
//                   "current": 35,
//                   "sum": 227,
//                   "count": 20,
//                   "useRange": true,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           }
//       ],
//       "latestTimesliceData": 11
//   },
//   "endToEndLatencyData": {
//       "metricId": 0,
//       "metricName": null,
//       "frequency": null,
//       "granularityMinutes": 0,
//       "dataTimeslices": [],
//       "latestTimesliceData": -1
//   },
//   "callsPerMinuteData": {
//       "metricId": 92106231,
//       "metricName": "BTM|Application Summary|Component:4275719|Calls per Minute",
//       "frequency": "ONE_MIN",
//       "granularityMinutes": 1,
//       "dataTimeslices": [
//           {
//               "startTime": 1737303780000,
//               "metricValue": {
//                   "value": 10,
//                   "min": 4,
//                   "max": 6,
//                   "current": 10,
//                   "sum": 10,
//                   "count": 2,
//                   "useRange": false,
//                   "groupCount": 200,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737303840000,
//               "metricValue": {
//                   "value": 10,
//                   "min": 5,
//                   "max": 5,
//                   "current": 10,
//                   "sum": 10,
//                   "count": 2,
//                   "useRange": false,
//                   "groupCount": 200,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737303900000,
//               "metricValue": {
//                   "value": 12,
//                   "min": 6,
//                   "max": 6,
//                   "current": 12,
//                   "sum": 12,
//                   "count": 2,
//                   "useRange": false,
//                   "groupCount": 200,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737303960000,
//               "metricValue": {
//                   "value": 9,
//                   "min": 4,
//                   "max": 5,
//                   "current": 9,
//                   "sum": 9,
//                   "count": 2,
//                   "useRange": false,
//                   "groupCount": 200,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304020000,
//               "metricValue": {
//                   "value": 11,
//                   "min": 5,
//                   "max": 6,
//                   "current": 11,
//                   "sum": 11,
//                   "count": 2,
//                   "useRange": false,
//                   "groupCount": 200,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304080000,
//               "metricValue": {
//                   "value": 4,
//                   "min": 4,
//                   "max": 4,
//                   "current": 4,
//                   "sum": 4,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304140000,
//               "metricValue": {
//                   "value": 4,
//                   "min": 4,
//                   "max": 4,
//                   "current": 4,
//                   "sum": 4,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304200000,
//               "metricValue": {
//                   "value": 4,
//                   "min": 4,
//                   "max": 4,
//                   "current": 4,
//                   "sum": 4,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304260000,
//               "metricValue": {
//                   "value": 4,
//                   "min": 4,
//                   "max": 4,
//                   "current": 4,
//                   "sum": 4,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304320000,
//               "metricValue": {
//                   "value": 4,
//                   "min": 4,
//                   "max": 4,
//                   "current": 4,
//                   "sum": 4,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304380000,
//               "metricValue": {
//                   "value": 4,
//                   "min": 4,
//                   "max": 4,
//                   "current": 4,
//                   "sum": 4,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304440000,
//               "metricValue": {
//                   "value": 8,
//                   "min": 8,
//                   "max": 8,
//                   "current": 8,
//                   "sum": 8,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304500000,
//               "metricValue": {
//                   "value": 4,
//                   "min": 4,
//                   "max": 4,
//                   "current": 4,
//                   "sum": 4,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304560000,
//               "metricValue": {
//                   "value": 4,
//                   "min": 4,
//                   "max": 4,
//                   "current": 4,
//                   "sum": 4,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304620000,
//               "metricValue": {
//                   "value": 7,
//                   "min": 7,
//                   "max": 7,
//                   "current": 7,
//                   "sum": 7,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304680000,
//               "metricValue": {
//                   "value": 4,
//                   "min": 4,
//                   "max": 4,
//                   "current": 4,
//                   "sum": 4,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304740000,
//               "metricValue": {
//                   "value": 4,
//                   "min": 4,
//                   "max": 4,
//                   "current": 4,
//                   "sum": 4,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304800000,
//               "metricValue": {
//                   "value": 4,
//                   "min": 4,
//                   "max": 4,
//                   "current": 4,
//                   "sum": 4,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304860000,
//               "metricValue": {
//                   "value": 4,
//                   "min": 4,
//                   "max": 4,
//                   "current": 4,
//                   "sum": 4,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304920000,
//               "metricValue": {
//                   "value": 4,
//                   "min": 4,
//                   "max": 4,
//                   "current": 4,
//                   "sum": 4,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304980000,
//               "metricValue": {
//                   "value": 4,
//                   "min": 4,
//                   "max": 4,
//                   "current": 4,
//                   "sum": 4,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305040000,
//               "metricValue": {
//                   "value": 8,
//                   "min": 8,
//                   "max": 8,
//                   "current": 8,
//                   "sum": 8,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305100000,
//               "metricValue": {
//                   "value": 4,
//                   "min": 4,
//                   "max": 4,
//                   "current": 4,
//                   "sum": 4,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305160000,
//               "metricValue": {
//                   "value": 4,
//                   "min": 4,
//                   "max": 4,
//                   "current": 4,
//                   "sum": 4,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305220000,
//               "metricValue": {
//                   "value": 7,
//                   "min": 7,
//                   "max": 7,
//                   "current": 7,
//                   "sum": 7,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305280000,
//               "metricValue": {
//                   "value": 4,
//                   "min": 4,
//                   "max": 4,
//                   "current": 4,
//                   "sum": 4,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305340000,
//               "metricValue": {
//                   "value": 4,
//                   "min": 4,
//                   "max": 4,
//                   "current": 4,
//                   "sum": 4,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305400000,
//               "metricValue": {
//                   "value": 4,
//                   "min": 4,
//                   "max": 4,
//                   "current": 4,
//                   "sum": 4,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305460000,
//               "metricValue": {
//                   "value": 5,
//                   "min": 5,
//                   "max": 5,
//                   "current": 5,
//                   "sum": 5,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305520000,
//               "metricValue": {
//                   "value": 4,
//                   "min": 4,
//                   "max": 4,
//                   "current": 4,
//                   "sum": 4,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305580000,
//               "metricValue": {
//                   "value": 4,
//                   "min": 4,
//                   "max": 4,
//                   "current": 4,
//                   "sum": 4,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305640000,
//               "metricValue": {
//                   "value": 8,
//                   "min": 8,
//                   "max": 8,
//                   "current": 8,
//                   "sum": 8,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305700000,
//               "metricValue": {
//                   "value": 4,
//                   "min": 4,
//                   "max": 4,
//                   "current": 4,
//                   "sum": 4,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305760000,
//               "metricValue": {
//                   "value": 4,
//                   "min": 4,
//                   "max": 4,
//                   "current": 4,
//                   "sum": 4,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305820000,
//               "metricValue": {
//                   "value": 7,
//                   "min": 7,
//                   "max": 7,
//                   "current": 7,
//                   "sum": 7,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305880000,
//               "metricValue": {
//                   "value": 4,
//                   "min": 4,
//                   "max": 4,
//                   "current": 4,
//                   "sum": 4,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305940000,
//               "metricValue": {
//                   "value": 4,
//                   "min": 4,
//                   "max": 4,
//                   "current": 4,
//                   "sum": 4,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306000000,
//               "metricValue": {
//                   "value": 4,
//                   "min": 4,
//                   "max": 4,
//                   "current": 4,
//                   "sum": 4,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306060000,
//               "metricValue": {
//                   "value": 4,
//                   "min": 4,
//                   "max": 4,
//                   "current": 4,
//                   "sum": 4,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306120000,
//               "metricValue": {
//                   "value": 4,
//                   "min": 4,
//                   "max": 4,
//                   "current": 4,
//                   "sum": 4,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306180000,
//               "metricValue": {
//                   "value": 4,
//                   "min": 4,
//                   "max": 4,
//                   "current": 4,
//                   "sum": 4,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306240000,
//               "metricValue": {
//                   "value": 8,
//                   "min": 8,
//                   "max": 8,
//                   "current": 8,
//                   "sum": 8,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306300000,
//               "metricValue": {
//                   "value": 4,
//                   "min": 4,
//                   "max": 4,
//                   "current": 4,
//                   "sum": 4,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306360000,
//               "metricValue": {
//                   "value": 4,
//                   "min": 4,
//                   "max": 4,
//                   "current": 4,
//                   "sum": 4,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306420000,
//               "metricValue": {
//                   "value": 7,
//                   "min": 7,
//                   "max": 7,
//                   "current": 7,
//                   "sum": 7,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306480000,
//               "metricValue": {
//                   "value": 4,
//                   "min": 4,
//                   "max": 4,
//                   "current": 4,
//                   "sum": 4,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306540000,
//               "metricValue": {
//                   "value": 4,
//                   "min": 4,
//                   "max": 4,
//                   "current": 4,
//                   "sum": 4,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306600000,
//               "metricValue": {
//                   "value": 4,
//                   "min": 4,
//                   "max": 4,
//                   "current": 4,
//                   "sum": 4,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306660000,
//               "metricValue": {
//                   "value": 4,
//                   "min": 4,
//                   "max": 4,
//                   "current": 4,
//                   "sum": 4,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306720000,
//               "metricValue": {
//                   "value": 4,
//                   "min": 4,
//                   "max": 4,
//                   "current": 4,
//                   "sum": 4,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306780000,
//               "metricValue": {
//                   "value": 4,
//                   "min": 4,
//                   "max": 4,
//                   "current": 4,
//                   "sum": 4,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306840000,
//               "metricValue": {
//                   "value": 8,
//                   "min": 8,
//                   "max": 8,
//                   "current": 8,
//                   "sum": 8,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306900000,
//               "metricValue": {
//                   "value": 4,
//                   "min": 4,
//                   "max": 4,
//                   "current": 4,
//                   "sum": 4,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306960000,
//               "metricValue": {
//                   "value": 4,
//                   "min": 4,
//                   "max": 4,
//                   "current": 4,
//                   "sum": 4,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737307020000,
//               "metricValue": {
//                   "value": 7,
//                   "min": 7,
//                   "max": 7,
//                   "current": 7,
//                   "sum": 7,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737307080000,
//               "metricValue": {
//                   "value": 4,
//                   "min": 4,
//                   "max": 4,
//                   "current": 4,
//                   "sum": 4,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737307140000,
//               "metricValue": {
//                   "value": 4,
//                   "min": 4,
//                   "max": 4,
//                   "current": 4,
//                   "sum": 4,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737307200000,
//               "metricValue": {
//                   "value": 16,
//                   "min": 16,
//                   "max": 16,
//                   "current": 16,
//                   "sum": 16,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737307260000,
//               "metricValue": {
//                   "value": 4,
//                   "min": 4,
//                   "max": 4,
//                   "current": 4,
//                   "sum": 4,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737307320000,
//               "metricValue": {
//                   "value": 20,
//                   "min": 20,
//                   "max": 20,
//                   "current": 20,
//                   "sum": 20,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           }
//       ],
//       "latestTimesliceData": 20
//   },
//   "errorsPerMinuteData": {
//       "metricId": 92106232,
//       "metricName": "BTM|Application Summary|Component:4275719|Errors per Minute",
//       "frequency": "ONE_MIN",
//       "granularityMinutes": 1,
//       "dataTimeslices": [
//           {
//               "startTime": 1737303780000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737303840000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737303900000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737303960000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304020000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304080000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304140000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304200000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304260000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304320000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304380000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304440000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304500000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304560000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304620000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304680000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304740000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304800000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304860000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304920000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304980000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305040000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305100000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305160000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305220000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305280000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305340000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305400000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305460000,
//               "metricValue": {
//                   "value": 1,
//                   "min": 1,
//                   "max": 1,
//                   "current": 1,
//                   "sum": 1,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305520000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305580000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305640000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305700000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305760000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305820000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305880000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305940000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306000000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306060000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306120000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306180000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306240000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306300000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306360000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306420000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306480000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306540000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306600000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306660000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306720000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306780000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306840000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306900000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306960000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737307020000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737307080000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737307140000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737307200000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737307260000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737307320000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           }
//       ],
//       "latestTimesliceData": 0
//   },
//   "numOfSlowCallsData": {
//       "metricId": 92106239,
//       "metricName": "BTM|Application Summary|Component:4275719|Number of Slow Calls",
//       "frequency": "ONE_MIN",
//       "granularityMinutes": 1,
//       "dataTimeslices": [
//           {
//               "startTime": 1737303780000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 200,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737303840000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 200,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737303900000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 200,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737303960000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 200,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304020000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 200,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304080000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304140000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304200000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304260000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304320000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304380000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304440000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304500000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304560000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304620000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304680000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304740000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304800000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304860000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304920000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304980000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305040000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305100000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305160000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305220000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305280000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305340000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305400000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305460000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305520000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305580000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305640000,
//               "metricValue": {
//                   "value": 1,
//                   "min": 1,
//                   "max": 1,
//                   "current": 1,
//                   "sum": 1,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305700000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305760000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305820000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305880000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737305940000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306000000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306060000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306120000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306180000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306240000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306300000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306360000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306420000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306480000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306540000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306600000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306660000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306720000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306780000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306840000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306900000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737306960000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737307020000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737307080000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737307140000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737307200000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737307260000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737307320000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           }
//       ],
//       "latestTimesliceData": 0
//   },
//   "numOfVerySlowCallsData": {
//       "metricId": 92106240,
//       "metricName": "BTM|Application Summary|Component:4275719|Number of Very Slow Calls",
//       "frequency": "ONE_MIN",
//       "granularityMinutes": 1,
//       "dataTimeslices": [
//           {
//               "startTime": 1737303780000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 200,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737303840000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 200,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737303900000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737303960000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304020000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304080000,
//               "metricValue": null
//           },
//           {
//               "startTime": 1737307320000,
//               "metricValue": null
//           }
//       ],
//       "latestTimesliceData": 0
//   },
//   "numOfStallsData": {
//       "metricId": 92106241,
//       "metricName": "BTM|Application Summary|Component:4275719|Stall Count",
//       "frequency": "ONE_MIN",
//       "granularityMinutes": 1,
//       "dataTimeslices": [
//           {
//               "startTime": 1737303780000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737303840000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737303900000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737303960000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 1,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304020000,
//               "metricValue": {
//                   "value": 0,
//                   "min": 0,
//                   "max": 0,
//                   "current": 0,
//                   "sum": 0,
//                   "count": 0,
//                   "useRange": false,
//                   "groupCount": 100,
//                   "standardDeviation": 0.0,
//                   "occurances": 1
//               }
//           },
//           {
//               "startTime": 1737304080000,
//               "metricValue": null
//           },
//           {
//               "startTime": 1737307320000,
//               "metricValue": null
//           }
//       ],
//       "latestTimesliceData": 0
//   },
//   "averageResponseTimeBaselineData": {
//       "metricId": 0,
//       "metricName": null,
//       "frequency": null,
//       "granularityMinutes": 0,
//       "dataTimeslices": [],
//       "latestTimesliceData": -1
//   },
//   "callsPerMinuteBaselineData": {
//       "metricId": 0,
//       "metricName": null,
//       "frequency": null,
//       "granularityMinutes": 0,
//       "dataTimeslices": [],
//       "latestTimesliceData": -1
//   },
//   "dataAvailable": true
// }

// // Assuming the given data is stored in a variable called 'data'
// const maxValue = extractMaxValue(data.averageResponseTimeData, 'Average Response Time');
// console.log(`The maximum value errorsPerMinuteData: ${maxValue}`);