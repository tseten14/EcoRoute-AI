import React from 'react';
import { EcoRouteResponse } from '../types';
import { ExternalLink, MapPin } from 'lucide-react';

interface RouteResultsProps {
  data: EcoRouteResponse | null;
  isLoading: boolean;
}

export const RouteResults: React.FC<RouteResultsProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-48 bg-slate-200 rounded-xl"></div>
        <div className="h-8 bg-slate-200 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded"></div>
          <div className="h-4 bg-slate-200 rounded"></div>
          <div className="h-4 bg-slate-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  // Helper to render the formatted text with simple parsing
  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <h3 key={index} className="text-lg font-bold text-slate-900 mt-6 mb-3">{line.replace(/\*\*/g, '')}</h3>;
      } else if (line.startsWith('## ')) {
        return <h3 key={index} className="text-xl font-bold text-emerald-900 mt-6 mb-3 border-b border-emerald-100 pb-2">{line.replace('## ', '')}</h3>;
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={index} className="ml-4 pl-2 text-slate-700 my-1.5 relative before:content-['•'] before:absolute before:left-[-1rem] before:text-emerald-500">
            {formatBold(line.substring(2))}
          </li>
        );
      } else if (line.trim() === '') {
        return <div key={index} className="h-2"></div>;
      } else {
        return <p key={index} className="text-slate-700 leading-relaxed mb-2">{formatBold(line)}</p>;
      }
    });
  };

  // Helper to highlight bold text within lines
  const formatBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Main Route Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="prose prose-slate max-w-none">
            {renderFormattedText(data.text)}
          </div>
        </div>
      </div>

      {/* Map Sources Grounding */}
      {data.groundingChunks && data.groundingChunks.length > 0 && (
        <div className="bg-emerald-900 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-emerald-800/50 bg-emerald-800/30">
            <h3 className="text-emerald-100 font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Verified Locations Found
            </h3>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.groundingChunks.map((chunk, idx) => {
              const mapData = chunk.web || chunk.mobile || chunk.maps;
              // Usually groundingChunks.web contains the uri for search/maps grounding in generic context,
              // but with the googleMaps tool specifically, we check what's returned.
              // Often title and uri are present.
              
              if (!mapData?.title || !mapData?.uri) return null;

              return (
                <a 
                  key={idx} 
                  href={mapData.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-3 rounded-lg bg-emerald-800/40 hover:bg-emerald-800/60 transition-colors group"
                >
                  <div className="bg-emerald-500/20 p-2 rounded-md group-hover:bg-emerald-500/30">
                    <ExternalLink className="w-4 h-4 text-emerald-300" />
                  </div>
                  <div>
                    <div className="text-emerald-50 font-medium text-sm line-clamp-1">
                      {mapData.title}
                    </div>
                    <div className="text-emerald-400 text-xs mt-0.5">
                      View on Google Maps
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
          <div className="px-6 py-3 bg-emerald-950/30 text-xs text-emerald-400/60 text-center">
            Locations sourced directly from Google Maps Platform
          </div>
        </div>
      )}
    </div>
  );
};