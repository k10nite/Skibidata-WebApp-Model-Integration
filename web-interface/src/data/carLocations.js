// CAR (Cordillera Administrative Region) Locations Database
// Focus on highland vegetable-producing municipalities

export const CAR_MUNICIPALITIES = [
  {
    id: 'la_trinidad',
    name: 'La Trinidad',
    province: 'Benguet',
    coordinates: {
      lat: 16.4601,
      lng: 120.5948,
      zoom: 13
    },
    elevation: '1,300-1,500m',
    description: 'Vegetable bowl of the Philippines',
    mainCrops: ['tomato', 'cabbage', 'lettuce', 'carrots'],
    barangays: [
      { name: 'Alapang', lat: 16.4456, lng: 120.5956 },
      { name: 'Bahong', lat: 16.4601, lng: 120.5948 },
      { name: 'Wangal', lat: 16.4523, lng: 120.5812 },
      { name: 'Betag', lat: 16.4489, lng: 120.5889 },
      { name: 'Shilan', lat: 16.4634, lng: 120.5923 }
    ]
  },
  {
    id: 'atok',
    name: 'Atok',
    province: 'Benguet',
    coordinates: {
      lat: 16.5532,
      lng: 120.6989,
      zoom: 12
    },
    elevation: '1,800-2,200m',
    description: 'High-elevation vegetable production area',
    mainCrops: ['potato', 'cabbage', 'carrots'],
    barangays: [
      { name: 'Paoay', lat: 16.5532, lng: 120.6989 },
      { name: 'Cattubo', lat: 16.5489, lng: 120.6745 },
      { name: 'Naguey', lat: 16.5678, lng: 120.7012 },
      { name: 'Topdac', lat: 16.5423, lng: 120.6856 }
    ]
  },
  {
    id: 'tublay',
    name: 'Tublay',
    province: 'Benguet',
    coordinates: {
      lat: 16.5089,
      lng: 120.6234,
      zoom: 13
    },
    elevation: '1,400-1,800m',
    description: 'Coffee and vegetable production',
    mainCrops: ['cabbage', 'potato', 'carrots', 'lettuce'],
    barangays: [
      { name: 'Ambongdolan', lat: 16.5134, lng: 120.6189 },
      { name: 'Tuel', lat: 16.5089, lng: 120.6234 },
      { name: 'Tublay Central', lat: 16.5012, lng: 120.6267 }
    ]
  },
  {
    id: 'buguias',
    name: 'Buguias',
    province: 'Benguet',
    coordinates: {
      lat: 16.7333,
      lng: 120.8167,
      zoom: 12
    },
    elevation: '1,600-2,400m',
    description: 'Major vegetable production area',
    mainCrops: ['cabbage', 'potato', 'carrots'],
    barangays: [
      { name: 'Abatan', lat: 16.7456, lng: 120.8234 },
      { name: 'Lengaoan', lat: 16.7289, lng: 120.8145 },
      { name: 'Natubleng', lat: 16.7333, lng: 120.8167 }
    ]
  }
];

// Helper functions
export function getMunicipalityById(id) {
  return CAR_MUNICIPALITIES.find(m => m.id === id);
}

export function getMunicipalityByCoordinates(lat, lng) {
  // Find nearest municipality
  let nearest = CAR_MUNICIPALITIES[0];
  let minDist = Infinity;

  CAR_MUNICIPALITIES.forEach(muni => {
    const dist = Math.sqrt(
      Math.pow(muni.coordinates.lat - lat, 2) +
      Math.pow(muni.coordinates.lng - lng, 2)
    );
    if (dist < minDist) {
      minDist = dist;
      nearest = muni;
    }
  });

  return nearest;
}

export function getAllBarangays() {
  return CAR_MUNICIPALITIES.flatMap(muni =>
    muni.barangays.map(brgy => ({
      ...brgy,
      municipality: muni.name,
      province: muni.province
    }))
  );
}

// CAR Region bounds for map centering
export const CAR_BOUNDS = {
  center: {
    lat: 16.5532,
    lng: 120.6989
  },
  zoom: 10,
  minZoom: 9,
  maxZoom: 16
};
