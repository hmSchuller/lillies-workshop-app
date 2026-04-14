package com.datepickerexercise

import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.NativeDatePickerViewManagerDelegate
import com.facebook.react.viewmanagers.NativeDatePickerViewManagerInterface
import java.time.Instant

@ReactModule(name = RNDatePickerManager.REACT_CLASS)
class RNDatePickerManager :
    SimpleViewManager<DatePickerButton>(),
    NativeDatePickerViewManagerInterface<DatePickerButton> {

  private val delegate: ViewManagerDelegate<DatePickerButton> =
      NativeDatePickerViewManagerDelegate(this)

  override fun getDelegate(): ViewManagerDelegate<DatePickerButton> = delegate

  override fun getName(): String = REACT_CLASS

  override fun createViewInstance(context: ThemedReactContext): DatePickerButton =
      DatePickerButton(context)

  // TODO (Level 2 Android): Implement each @ReactProp setter below.
  //
  // Each method receives the view and a prop value from the JS side.
  // Parse strings into Instants, map mode strings to the enum, and
  // forward to the appropriate DatePickerButton setter.

  @ReactProp(name = "date")
  override fun setDate(view: DatePickerButton, date: String?) {
    // TODO: Parse date ISO string into an Instant and call view.setDate(...)
    //       Use Instant.parse(). Fall back to Instant.now() if null.
  }

  @ReactProp(name = "minimumDate")
  override fun setMinimumDate(view: DatePickerButton, minimumDate: String?) {
    // TODO: Parse minimumDate ISO string and call view.setMinimumDate(...)
    //       Pass null when the string is null.
  }

  @ReactProp(name = "maximumDate")
  override fun setMaximumDate(view: DatePickerButton, maximumDate: String?) {
    // TODO: Parse maximumDate ISO string and call view.setMaximumDate(...)
    //       Pass null when the string is null.
  }

  @ReactProp(name = "mode")
  override fun setMode(view: DatePickerButton, mode: String?) {
    // TODO: Convert mode string to DatePickerButton.PickerMode and call view.setMode(...)
  }

  @ReactProp(name = "accentColor", customType = "Color")
  override fun setAccentColor(view: DatePickerButton, accentColor: Int?) {
    // TODO: Forward the color to view.setAccentColor(...)
  }

  override fun getExportedCustomBubblingEventTypeConstants(): Map<String, Any> =
      mapOf(
          "onChange" to
              mapOf(
                  "phasedRegistrationNames" to
                      mapOf(
                          "bubbled" to "onChange",
                          "captured" to "onChangeCapture",
                      ),
              ),
      )

  companion object {
    const val REACT_CLASS = "NativeDatePickerView"

    private fun parseInstant(value: String?): Instant? =
        value?.let { runCatching { Instant.parse(it) }.getOrNull() }
  }
}
