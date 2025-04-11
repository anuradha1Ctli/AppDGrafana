export function extractMaxValue(dataArray, metricName) {
  if (!dataArray || dataArray.length === 0) {
    return 0;
  }

  const values = dataArray.map(item => item.value || 0);
  const maxValue = Math.max(...values);

  return maxValue;
}
