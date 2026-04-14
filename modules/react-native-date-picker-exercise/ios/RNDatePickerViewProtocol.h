#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * Pure ObjC protocol (no C++, no ObjC++) that defines the public API of the
 * Swift UIView that owns all UIDatePicker logic.
 *
 * The ObjC++ shell (RNDatePickerFabricView) communicates with the Swift view
 * exclusively through this protocol, which avoids any dependency on the
 * generated -Swift.h header and allows the Swift class to live in the host
 * app target rather than in the pod.
 */
@protocol RNDatePickerViewProtocol <NSObject>

/// Invoked on the main thread whenever the user selects a new date.
/// The string is an ISO 8601 date with milliseconds, e.g. "2024-06-15T00:00:00.000Z".
@property (nonatomic, copy, nullable) void (^onChange)(NSString *isoString);

/// Sets the currently selected date from an ISO 8601 string.
- (void)setDateISO:(NSString *)iso;

/// Sets the lower bound. Pass nil to clear it.
- (void)setMinimumDateISO:(nullable NSString *)iso;

/// Sets the upper bound. Pass nil to clear it.
- (void)setMaximumDateISO:(nullable NSString *)iso;

/// Maps the JS mode string ("date" | "time" | "datetime") to UIDatePicker.Mode.
- (void)setPickerMode:(NSString *)mode;

/// Applies an optional accent/tint color. Pass nil to restore the system default.
- (void)setPickerAccentColor:(nullable UIColor *)color;

/// Resets all mutable state so the view can be safely reused by Fabric's recycler.
- (void)resetForRecycle;

@end

NS_ASSUME_NONNULL_END
