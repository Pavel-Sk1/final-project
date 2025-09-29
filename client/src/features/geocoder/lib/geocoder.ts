import axios from 'axios';


export async function geocode(address: string) {
  const url = 'https://nominatim.openstreetmap.org/search';

  try {
    const response = await axios.get(url, {
      params: {
        q: address,
        format: 'json',
        limit: 1,
      },
      headers: {
        'Accept-Language': 'ru', // если хотите русский язык результата
        'User-Agent': 'YourAppName/1.0 (your.email@example.com)', // обязательно для Nominatim
      },
    });

    const data = response.data;

    if (Array.isArray(data) && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
      };
    }

    return null;
  } catch (error) {
    console.error('Ошибка геокодирования:', error);
    return null;
  }
}