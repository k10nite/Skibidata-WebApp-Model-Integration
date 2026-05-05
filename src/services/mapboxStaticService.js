// Builds Mapbox Static Images API URLs for previewing the user's drawn polygon.
// Docs: https://docs.mapbox.com/api/maps/static-images/

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const STYLE = 'mapbox/satellite-streets-v12';

// Encode a GeoJSON object into the Static API's geojson() overlay format.
// We add inline simplestyle-spec properties so the polygon renders with
// our moss outline + paper-coloured fill.
export function buildPolygonPreviewUrl(polygon, opts = {}) {
  if (!TOKEN || !polygon) return null;

  const width = opts.width ?? 600;
  const height = opts.height ?? 360;
  const retina = opts.retina ?? true;
  const stroke = opts.stroke ?? '#4F5B2F';   // var(--color-moss)
  const fill = opts.fill ?? '#FAF7F0';        // var(--color-paper-card)

  const feature = {
    type: 'Feature',
    properties: {
      stroke,
      'stroke-width': 2.5,
      'stroke-opacity': 0.95,
      fill,
      'fill-opacity': 0.25
    },
    geometry: polygon
  };

  const encoded = encodeURIComponent(JSON.stringify(feature));
  const dim = `${width}x${height}${retina ? '@2x' : ''}`;
  return `https://api.mapbox.com/styles/v1/${STYLE}/static/geojson(${encoded})/auto/${dim}?access_token=${TOKEN}&padding=24`;
}
