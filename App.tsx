import React, { useState, useEffect } from 'react';
import { Layout, Leaf, MapPin, Navigation, Info, BatteryCharging } from 'lucide-react';
import { RouteForm } from './components/RouteForm';
import { RouteResults } from './components/RouteResults';
import { getEcoRoute } from './services/geminiService';
import { EcoRouteResponse, LocationCoords } from './types';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<EcoRouteResponse | null>(null);
  const [userLocation, setUserLocation] = useState<LocationCoords | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (err) => {
          console.warn("Geolocation permission denied or error:", err);
        }
      );
    }
  }, []);

  const handlePlanRoute = async (origin: string, destination: string, vehicleType: string) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await getEcoRoute(origin, destination, vehicleType, userLocation);
      setResponse(result);
    } catch (err: any) {
      setError(err.message || "Failed to generate eco-friendly route. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-emerald-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500 p-1.5 rounded-lg">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">EcoRoute AI</h1>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-sm text-emerald-100">
            <span className="flex items-center gap-1">
              <BatteryCharging className="w-4 h-4" />
              <span>Clean Energy Optimized</span>
            </span>
            <span className="flex items-center gap-1">
              <Navigation className="w-4 h-4" />
              <span>Google Maps Data</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8 grid grid-cols-1 lg:grid-cols-3">
        
        {/* Left Column: Controls */}
        <div className="lg:col-span-1 space-y-6">
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-emerald-600" />
              Plan Your Trip
            </h2>
            <RouteForm 
              onSubmit={handlePlanRoute} 
              isLoading={loading} 
              userLocation={userLocation}
            />
          </section>

          <section className="bg-emerald-50 rounded-2xl border border-emerald-100 p-5">
            <h3 className="text-emerald-900 font-medium mb-2 flex items-center gap-2">
              <Info className="w-4 h-4" />
              How it works
            </h3>
            <p className="text-sm text-emerald-800 leading-relaxed">
              We use Google's latest AI models grounded with real-time Google Maps data to find the most energy-efficient routes, locate EV chargers, and suggest green stops.
            </p>
          </section>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-2">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {!loading && !response && !error && (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">Ready to explore?</h3>
              <p className="text-slate-500 max-w-sm mt-2">
                Enter your origin and destination to find the most efficient clean energy route.
              </p>
            </div>
          )}

          {(loading || response) && (
            <RouteResults 
              isLoading={loading} 
              data={response} 
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} EcoRoute AI. Powered by Google Gemini.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;