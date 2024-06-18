import { format } from 'date-fns';

export default async function fetchStartRangeData(startDate) {
  const formattedDate = format(startDate, 'dd-MM-yyyy');
  const response = await fetch(
    `https://ebj84usrbb.execute-api.us-east-1.amazonaws.com/api/noche?start_date=${formattedDate}`
  );
  const data = await response.json();
  return data;
}
