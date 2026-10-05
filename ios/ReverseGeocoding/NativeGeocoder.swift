import Foundation
import CoreLocation

@objc(NativeGeocoder)
class NativeGeocoder: NSObject {
  
  private let geocoder = CLGeocoder()

  @objc(getAddressFromCoordinates:withResolver:withRejecter:)
  func getAddressFromCoordinates(
    coords: NSDictionary,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    // 1. Extract coordinates from the dictionary passed by React Native
    guard
      let latitude = coords["latitude"] as? CLLocationDegrees,
      let longitude = coords["longitude"] as? CLLocationDegrees
    else {
      reject("INVALID_COORDS", "Invalid coordinates provided.", nil)
      return
    }

    // 2. Create a CLLocation object
    let location = CLLocation(latitude: latitude, longitude: longitude)
    
    // 3. Perform the reverse geocoding
    geocoder.reverseGeocodeLocation(location) { placemarks, error in
      if let error = error {
        reject("REVERSE_GEOCODE_ERROR", error.localizedDescription, error)
        return
      }

      guard let placemark = placemarks?.first else {
        // If no results are found, resolve with "Unknown" values
        let fallbackResult = [
          "street": "Unknown",
          "city": "Unknown",
          "state": "Unknown",
          "country": "Unknown",
          "postalCode": "Unknown"
        ]
        resolve(fallbackResult)
        return
      }

      // 4. Format the address components into a dictionary
      let addressDetails = [
        "street": placemark.name ?? "Unknown",
        "city": placemark.locality ?? "Unknown",
        "state": placemark.administrativeArea ?? "Unknown",
        "country": placemark.country ?? "Unknown",
        "postalCode": placemark.postalCode ?? "Unknown"
      ]
      resolve(addressDetails)
    }
  }
  
  @objc(getCoordinatesFromAddress:withResolver:withRejecter:)
  func getCoordinatesFromAddress(
    addressString: String,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    // 1. Perform forward geocoding from an address string
    geocoder.geocodeAddressString(addressString) { placemarks, error in
      if let error = error {
        reject("FORWARD_GEOCODE_ERROR", error.localizedDescription, error)
        return
      }

      guard let location = placemarks?.first?.location else {
        reject("NO_LOCATION_FOUND", "No location was found for the given address.", nil)
        return
      }

      // 2. Resolve with the coordinates
      let coordinates = [
        "latitude": location.coordinate.latitude,
        "longitude": location.coordinate.longitude
      ]
      resolve(coordinates)
    }
  }
}