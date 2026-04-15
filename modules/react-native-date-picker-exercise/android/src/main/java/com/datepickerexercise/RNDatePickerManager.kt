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


  @ReactProp(name = "date")
  override fun setDate(view: DatePickerButton, date: String?) {
    view.setDate(parseInstant(date) ?: Instant.now())
  }

  @ReactProp(name = "minimumDate")
  override fun setMinimumDate(view: DatePickerButton, minimumDate: String?) {
    view.setMinimumDate(parseInstant(minimumDate))
  }

  @ReactProp(name = "maximumDate")
  override fun setMaximumDate(view: DatePickerButton, maximumDate: String?) {
    view.setMaximumDate(parseInstant(maximumDate))
  }

  @ReactProp(name = "mode")
  override fun setMode(view: DatePickerButton, mode: String?) {
    view.setMode(DatePickerButton.PickerMode.fromProp(mode))
  }

  @ReactProp(name = "accentColor", customType = "Color")
  override fun setAccentColor(view: DatePickerButton, accentColor: Int?) {
    view.setAccentColor(accentColor)
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
