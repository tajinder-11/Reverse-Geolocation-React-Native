#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

// Expose the NativeGeocoder module to React Native
@interface RCT_EXTERN_MODULE(NativeGeocoder, NSObject)

// Expose the getAddressFromCoordinates method
RCT_EXTERN_METHOD(
  getAddressFromCoordinates:(NSDictionary *)coords
  withResolver:(RCTPromiseResolveBlock)resolve
  withRejecter:(RCTPromiseRejectBlock)reject
)

// Expose the getCoordinatesFromAddress method
RCT_EXTERN_METHOD(
  getCoordinatesFromAddress:(NSString *)addressString
  withResolver:(RCTPromiseResolveBlock)resolve
  withRejecter:(RCTPromiseRejectBlock)reject
)

@end