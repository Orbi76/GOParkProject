interface ParkingSpot {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

const fetchParkingSpots = async (latitude: number, longitude: number) => {
  // Overpass API URL for querying parking spots within a 1000m radius
  const url = `https://overpass-api.de/api/interpreter?data=[out:json];node["amenity"="parking"](around:1000,${latitude},${longitude});out;`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.elements && data.elements.length > 0) {
      return data.elements.map((element: any) => ({
        id: element.id.toString(),
        name: element.tags.name || 'Unnamed Parking',
        latitude: element.lat,
        longitude: element.lon,
      }));
    } else {
      console.warn('No parking data found for this location');
    }
  } catch (error) {
    console.error('Error fetching parking data:', error);
  }

  return [];
};

export default fetchParkingSpots;
