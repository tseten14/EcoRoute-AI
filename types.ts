export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  mobile?: {
    uri: string;
    title: string;
  };
  maps?: {
    placeId: string;
    uri: string; // Google Maps link
    title: string;
  };
}

export interface EcoRouteResponse {
  text: string;
  groundingChunks: GroundingChunk[];
}

export enum VehicleType {
  EV = "Electric Vehicle (EV)",
  HYBRID = "Hybrid",
  STANDARD = "Standard (Gas)"
}