import React, { useState } from 'react';
import { MapPin, Car, Zap, Navigation, Leaf } from 'lucide-react';
import { LocationCoords, VehicleType } from '../types';

interface RouteFormProps {
  onSubmit: (origin: string, destination: string, vehicleType: string) => void;
  isLoading: boolean;
  userLocation: LocationCoords | null;
}

export const RouteForm: React.FC<RouteFormProps> = ({ onSubmit, isLoading, userLocation }) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [vehicleType, setVehicleType] = useState<string>(VehicleType.EV);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (origin.trim() && destination.trim()) {
      onSubmit(origin, destination, vehicleType);
    }
  };

  const useCurrentLocation = () => {
    if (userLocation) {
      // In a real app, we might reverse geocode here, but for this text-based model prompt, 
      // "My current location" works if we pass lat/lng in toolConfig, 
      // OR we can just send the text "My Current Location" and Gemini uses the toolConfig lat/long to resolve it.
      setOrigin("My Current Location");
    } else {
      alert("Location access is not enabled.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Origin Input */}
      <div className="space-y-1.5">
        <label htmlFor="origin" className="block text-sm font-medium text-slate-700">
          Starting Point
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
          </div>
          <input
            type="text"
            id="origin"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="block w-full pl-8 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-shadow"
            placeholder="e.g. San Francisco, CA"
            required
          />
          <button
            type="button"
            onClick={useCurrentLocation}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-emerald-600"
            title="Use current location"
          >
            <Navigation className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Destination Input */}
      <div className="space-y-1.5">
        <label htmlFor="destination" className="block text-sm font-medium text-slate-700">
          Destination
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="w-4 h-4 text-red-500" />
          </div>
          <input
            type="text"
            id="destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="block w-full pl-9 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-shadow"
            placeholder="e.g. Los Angeles, CA"
            required
          />
        </div>
      </div>

      {/* Vehicle Type Selection */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700">Vehicle Type</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: VehicleType.EV, icon: Zap, label: 'EV' },
            { id: VehicleType.HYBRID, icon: Leaf, label: 'Hybrid' },
            { id: VehicleType.STANDARD, icon: Car, label: 'Gas' },
          ].map((type) => {
            const Icon = type.icon;
            const isSelected = vehicleType === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => setVehicleType(type.id)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg border text-sm font-medium transition-all ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-1 ring-emerald-500'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                {type.label}
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all ${
          isLoading ? 'opacity-75 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing Maps Data...
          </>
        ) : (
          'Find Eco Route'
        )}
      </button>
    </form>
  );
};