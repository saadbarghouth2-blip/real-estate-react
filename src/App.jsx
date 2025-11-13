import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function App() {
  const [properties, setProperties] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetch('/data/properties.geojson')
      .then(res => res.json())
      .then(data => setProperties(data.features));
  }, []);

  const filtered =
    filter === 'All'
      ? properties
      : properties.filter(f => f.properties.type === filter);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <aside className="w-full md:w-1/3 bg-white shadow-xl p-4 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">🏠 Real Estate Map</h1>
        <div className="flex gap-2 mb-4">
          {['All', 'Apartment', 'Villa'].map(t => (
            <button
              key={t}
              className={`px-4 py-2 rounded ${filter === t ? 'bg-blue-500 text-white' : 'border'}`}
              onClick={() => setFilter(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {filtered.map(p => (
            <div key={p.properties.id} className="border rounded-xl shadow p-2">
              <img src={p.properties.image} alt={p.properties.name} className="rounded-xl mb-2" />
              <h2 className="text-lg font-semibold">{p.properties.name}</h2>
              <p className="text-sm text-gray-600">{p.properties.type}</p>
              <p className="text-blue-600 font-bold">${p.properties.price.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </aside>
      <main className="flex-1">
        <MapContainer center={[30.0444, 31.2357]} zoom={13} className="h-full w-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {filtered.map(p => (
            <Marker key={p.properties.id} position={[p.geometry.coordinates[1], p.geometry.coordinates[0]]}>
              <Popup>
                <b>{p.properties.name}</b>
                <br />
                {p.properties.type} - ${p.properties.price.toLocaleString()}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </main>
    </div>
  );
}
