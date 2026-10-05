import { NativeModules } from 'react-native';

// Define the types for our geocoding results
export type GeocodedPlacemark = {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
};

export type Coordinates = {
  latitude: number;
  longitude: number;
};

// Define the interface for our native module
interface GeoModuleAPI {
  getAddressFromCoordinates(coords: Coordinates): Promise<GeocodedPlacemark>;
  getCoordinatesFromAddress(address: string): Promise<Coordinates>;
}

// Access the native module and cast it to our interface for type safety
const { NativeGeocoder } = NativeModules;

export default NativeGeocoder as GeoModuleAPI;