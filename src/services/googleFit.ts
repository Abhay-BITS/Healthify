import axios from 'axios';

const GOOGLE_FIT_API = 'https://www.googleapis.com/fitness/v1/users/me';
const CLIENT_ID = '943147131365-ed3ke6mfdskbce327pfsn0mbtu1v9aht.apps.googleusercontent.com';

const SCOPES = [
  'https://www.googleapis.com/auth/fitness.activity.read',
  'https://www.googleapis.com/auth/fitness.heart_rate.read',
  'https://www.googleapis.com/auth/fitness.sleep.read',
  'https://www.googleapis.com/auth/fitness.body.read'
].join(' ');

export const initGoogleFit = () => {
  return new Promise((resolve, reject) => {
    gapi.load('auth2', () => {
      gapi.auth2.init({
        client_id: CLIENT_ID,
        scope: SCOPES
      }).then(resolve, reject);
    });
  });
};

export const getGoogleFitData = async (accessToken: string) => {
  const endTime = new Date();
  const startTime = new Date();
  startTime.setDate(startTime.getDate() - 1);

  const dataTypesMap = {
    steps: 'com.google.step_count.delta',
    heartRate: 'com.google.heart_rate.bpm',
    calories: 'com.google.calories.expended',
    sleep: 'com.google.sleep.segment'
  };

  try {
    const responses = await Promise.all(
      Object.entries(dataTypesMap).map(([key, dataType]) =>
        axios.get(`${GOOGLE_FIT_API}/dataset:aggregate`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          params: {
            aggregateBy: [{
              dataTypeName: dataType
            }],
            startTimeMillis: startTime.getTime(),
            endTimeMillis: endTime.getTime()
          }
        })
      )
    );

    return responses.reduce((acc, response, index) => {
      const key = Object.keys(dataTypesMap)[index];
      acc[key] = processGoogleFitData(response.data, key);
      return acc;
    }, {});
  } catch (error) {
    console.error('Error fetching Google Fit data:', error);
    throw error;
  }
};

const processGoogleFitData = (data: any, type: string) => {
  if (!data.bucket || !data.bucket[0]) return 0;

  switch (type) {
    case 'steps':
      return data.bucket[0].dataset[0].point[0]?.value[0]?.intVal || 0;
    case 'heartRate':
      return Math.round(data.bucket[0].dataset[0].point[0]?.value[0]?.fpVal || 0);
    case 'calories':
      return Math.round(data.bucket[0].dataset[0].point[0]?.value[0]?.fpVal || 0);
    case 'sleep':
      const sleepSegments = data.bucket[0].dataset[0].point || [];
      return sleepSegments.reduce((total: number, segment: any) => {
        return total + (segment.value[0]?.intVal || 0);
      }, 0) / 3600000; // Convert milliseconds to hours
    default:
      return 0;
  }
};