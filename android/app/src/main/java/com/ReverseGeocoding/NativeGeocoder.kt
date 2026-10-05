package com.yourappname

import android.location.Geocoder
import com.facebook.react.bridge.*
import java.util.Locale

class NativeGeocoder(private val reactContext: ReactApplicationContext) 
  : ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    // This is the name that will be used to access the module from JavaScript
    return "NativeGeocoder"
  }

  @ReactMethod
  fun getAddressFromCoordinates(coords: ReadableMap, promise: Promise) {
    // Geocoding can be a long-running task, so we run it on a background thread
    Thread {
      try {
        // 1. Extract coordinates from the map
        val latitude = coords.getDouble("latitude")
        val longitude = coords.getDouble("longitude")
        
        // 2. Create a Geocoder instance
        val geocoder = Geocoder(reactContext, Locale.getDefault())

        // 3. Get a list of addresses (we only need the first one)
        val addresses = geocoder.getFromLocation(latitude, longitude, 1)
          ?: return@Thread promise.reject("GEOCODE_ERROR", "Geocoder returned a null response.")

        if (addresses.isEmpty()) {
          return@Thread promise.reject("NO_ADDRESS_FOUND", "No address was found for the coordinates.")
        }

        // 4. Format the first result into a WritableMap
        val address = addresses[0]
        val result = WritableNativeMap().apply {
          putString("street", address.featureName ?: "Unknown")
          putString("city", address.locality ?: "Unknown")
          putString("state", address.adminArea ?: "Unknown")
          putString("country", address.countryName ?: "Unknown")
          putString("postalCode", address.postalCode ?: "Unknown")
        }
        
        promise.resolve(result)
      } catch (e: Exception) {
        promise.reject("GEOCODE_ERROR", e.message ?: "An unknown error occurred.")
      }
    }.start()
  }

  @ReactMethod
  fun getCoordinatesFromAddress(addressString: String, promise: Promise) {
    // Run on a background thread to avoid blocking the UI
    Thread {
      try {
        val geocoder = Geocoder(reactContext, Locale.getDefault())
        val addresses = geocoder.getFromLocationName(addressString, 1)
          ?: return@Thread promise.reject("GEOCODE_ERROR", "Geocoder returned a null response.")

        if (addresses.isEmpty()) {
          return@Thread promise.reject("NO_LOCATION_FOUND", "No location was found for the given address.")
        }

        val location = addresses[0]
        val coordinates = WritableNativeMap().apply {
          putDouble("latitude", location.latitude)
          putDouble("longitude", location.longitude)
        }
        
        promise.resolve(coordinates)
      } catch (e: Exception) {
        promise.reject("GEOCODE_ERROR", e.message ?: "An unknown error occurred.")
      }
    }.start()
  }
}