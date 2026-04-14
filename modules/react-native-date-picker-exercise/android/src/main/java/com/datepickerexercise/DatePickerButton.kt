package com.datepickerexercise

import android.app.Activity
import android.app.DatePickerDialog
import android.app.TimePickerDialog
import android.content.Context
import android.content.ContextWrapper
import android.content.res.ColorStateList
import android.util.AttributeSet
import androidx.annotation.ColorInt
import androidx.appcompat.widget.AppCompatButton
import androidx.fragment.app.FragmentActivity
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.events.Event
import com.google.android.material.datepicker.CalendarConstraints
import com.google.android.material.datepicker.CompositeDateValidator
import com.google.android.material.datepicker.DateValidatorPointBackward
import com.google.android.material.datepicker.DateValidatorPointForward
import com.google.android.material.datepicker.MaterialDatePicker
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId
import java.time.ZoneOffset
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter
import java.time.format.FormatStyle

class DatePickerButton
@JvmOverloads
constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = android.R.attr.buttonStyle,
) : AppCompatButton(context, attrs, defStyleAttr) {

  enum class PickerMode {
    DATE,
    TIME,
    DATETIME;

    companion object {
      fun fromProp(value: String?): PickerMode =
          when (value) {
            "time" -> TIME
            "datetime" -> DATETIME
            else -> DATE
          }
    }
  }

  private val zoneId: ZoneId = ZoneId.systemDefault()
  private val dateFormatter = DateTimeFormatter.ofLocalizedDate(FormatStyle.MEDIUM)
  private val timeFormatter = DateTimeFormatter.ofLocalizedTime(FormatStyle.SHORT)
  private val dateTimeFormatter = DateTimeFormatter.ofLocalizedDateTime(FormatStyle.MEDIUM, FormatStyle.SHORT)
  private val defaultTextColors: ColorStateList = textColors

  private var selectedDateTime: ZonedDateTime = ZonedDateTime.now(zoneId).withSecond(0).withNano(0)
  private var minimumDate: Instant? = null
  private var maximumDate: Instant? = null
  private var mode: PickerMode = PickerMode.DATE

  init {
    isAllCaps = false
    setOnClickListener { openPicker() }
    updateLabel()
  }

  // TODO (Level 3 Android): Implement the public setters below.
  //
  // Each setter is called by RNDatePickerManager when a React prop changes.
  // After updating internal state, clamp the selected date/time to the
  // new bounds and call updateLabel() to refresh the button text.

  fun setDate(instant: Instant) {
    // TODO: Convert instant to ZonedDateTime, clamp, and store in selectedDateTime.
    //       Then call updateLabel().
  }

  fun setMinimumDate(instant: Instant?) {
    // TODO: Store the new minimum, clamp selectedDateTime, call updateLabel().
  }

  fun setMaximumDate(instant: Instant?) {
    // TODO: Store the new maximum, clamp selectedDateTime, call updateLabel().
  }

  fun setMode(mode: PickerMode) {
    // TODO: Store the new mode and call updateLabel().
  }

  fun setAccentColor(@ColorInt color: Int?) {
    // TODO: Apply the color to the button text.
    //       If color is null, restore the original defaultTextColors.
  }

  // TODO (Level 3 Android): Implement the picker dialogs.
  //
  // openPicker() should choose the right dialog(s) based on `mode`:
  //   - DATE     → openDatePicker(continueWithTime = false)
  //   - TIME     → openTimePicker()
  //   - DATETIME → openDatePicker(continueWithTime = true) then openTimePicker()
  //
  // openDatePicker: Use MaterialDatePicker if inside a FragmentActivity,
  //   otherwise fall back to DatePickerDialog.
  //   Apply min/max constraints via CalendarConstraints.
  //   On positive click: parse the selected UTC millis to a LocalDate and call applyDateSelection.
  //
  // openTimePicker: Use a TimePickerDialog. On selection: build a new ZonedDateTime
  //   from selectedDateTime + new hour/minute, clamp, and call emitAndRefresh().
  //
  // applyDateSelection: Merge the new LocalDate into selectedDateTime.
  //   If continueWithTime is true, open the time picker next. Otherwise emitAndRefresh().

  private fun openPicker() {
    // TODO: Implement
  }

  private fun openDatePicker(continueWithTime: Boolean) {
    // TODO: Implement
  }

  private fun openTimePicker() {
    // TODO: Implement
  }

  private fun applyDateSelection(localDate: LocalDate, continueWithTime: Boolean) {
    // TODO: Implement
  }

  // ── Provided helpers (do not modify) ──────────────────────────────────────

  private fun emitAndRefresh() {
    updateLabel()
    emitChange(selectedDateTime.toInstant())
  }

  private fun emitChange(instant: Instant) {
    val reactContext = context as? ReactContext ?: return
    val surfaceId = UIManagerHelper.getSurfaceId(reactContext)
    val eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, id) ?: return

    val payload: WritableMap = Arguments.createMap().apply { putString("date", instant.toString()) }
    eventDispatcher.dispatchEvent(OnChangeEvent(surfaceId, id, payload))
  }

  private fun updateLabel() {
    text =
        when (mode) {
          PickerMode.DATE -> selectedDateTime.toLocalDate().format(dateFormatter)
          PickerMode.TIME -> selectedDateTime.toLocalTime().format(timeFormatter)
          PickerMode.DATETIME -> selectedDateTime.format(dateTimeFormatter)
        }
  }

  private fun clamp(dateTime: ZonedDateTime): ZonedDateTime {
    val instant = dateTime.toInstant()

    if (minimumDate != null && instant.isBefore(minimumDate)) {
      return minimumDate!!.atZone(zoneId)
    }

    if (maximumDate != null && instant.isAfter(maximumDate)) {
      return maximumDate!!.atZone(zoneId)
    }

    return dateTime
  }

  private fun localDateAtUtcMillis(localDate: LocalDate): Long =
      localDate.atStartOfDay(ZoneOffset.UTC).toInstant().toEpochMilli()

  private fun localDateAtSystemMillis(localDate: LocalDate): Long =
      localDate.atStartOfDay(zoneId).toInstant().toEpochMilli()

  private fun findFragmentActivity(): FragmentActivity? {
    var currentContext: Context? = context

    while (currentContext is ContextWrapper) {
      when (currentContext) {
        is FragmentActivity -> return currentContext
        is Activity -> return null
      }

      currentContext = currentContext.baseContext
    }

    return null
  }

  private class OnChangeEvent(
      surfaceId: Int,
      viewId: Int,
      private val payload: WritableMap,
  ) : Event<OnChangeEvent>(surfaceId, viewId) {
    override fun getEventName(): String = "onChange"

    override fun getEventData(): WritableMap = payload
  }
}
