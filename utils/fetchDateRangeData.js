async function fetchDateRangeData(startDate, endDate) {
  let url = `https://ebj84usrbb.execute-api.us-east-1.amazonaws.com/api/noche?end_date=${endDate}&start_date=${startDate}`;

  const response = await fetch(url);
  const data = await response.json();

  console.log('URL FROM RANGE FUNC', url);

  return data;
}

export default fetchDateRangeData;
