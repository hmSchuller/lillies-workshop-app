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

  fun setDate(instant: Instant) {
    selectedDateTime = clamp(instant.atZone(zoneId))
    updateLabel()
  }

  fun setMinimumDate(instant: Instant?) {
    minimumDate = instant
    selectedDateTime = clamp(selectedDateTime)
    updateLabel()
  }

  fun setMaximumDate(instant: Instant?) {
    maximumDate = instant
    selectedDateTime = clamp(selectedDateTime)
    updateLabel()
  }

  fun setMode(mode: PickerMode) {
    this.mode = mode
    updateLabel()
  }

  fun setAccentColor(@ColorInt color: Int?) {
    color?.let {
      setTextColor(it)
    } ?: run {
      setTextColor(defaultTextColors)
    }
  }

  private fun openPicker() {
    when (mode) {
      PickerMode.DATE -> openDatePicker(continueWithTime = false)
      PickerMode.TIME -> openTimePicker()
      PickerMode.DATETIME -> openDatePicker(continueWithTime = true)
    }
  }

  private fun openDatePicker(continueWithTime: Boolean) {
    val fragmentActivity = findFragmentActivity()

    if (fragmentActivity != null) {
      val constraintsBuilder = CalendarConstraints.Builder()
      val validators = mutableListOf<CalendarConstraints.DateValidator>()

      minimumDate?.let {
        constraintsBuilder.setStart(localDateAtUtcMillis(it.atZone(zoneId).toLocalDate()))
        validators += DateValidatorPointForward.from(localDateAtUtcMillis(it.atZone(zoneId).toLocalDate()))
      }

      maximumDate?.let {
        constraintsBuilder.setEnd(localDateAtUtcMillis(it.atZone(zoneId).toLocalDate()))
        validators += DateValidatorPointBackward.before(localDateAtUtcMillis(it.atZone(zoneId).toLocalDate()))
      }

      if (validators.isNotEmpty()) {
        constraintsBuilder.setValidator(CompositeDateValidator.allOf(validators))
      }

      val picker =
          MaterialDatePicker.Builder.datePicker()
              .setSelection(localDateAtUtcMillis(selectedDateTime.toLocalDate()))
              .setCalendarConstraints(constraintsBuilder.build())
              .build()

      picker.addOnPositiveButtonClickListener { utcMillis ->
        val localDate = Instant.ofEpochMilli(utcMillis).atZone(ZoneOffset.UTC).toLocalDate()
        applyDateSelection(localDate, continueWithTime)
      }

      picker.show(fragmentActivity.supportFragmentManager, "native_date_picker")
      return
    }

    val dialog =
        DatePickerDialog(
            context,
            { _, year, monthOfYear, dayOfMonth ->
              applyDateSelection(LocalDate.of(year, monthOfYear + 1, dayOfMonth), continueWithTime)
            },
            selectedDateTime.year,
            selectedDateTime.monthValue - 1,
            selectedDateTime.dayOfMonth,
        )

    minimumDate?.let {
      dialog.datePicker.minDate = localDateAtSystemMillis(it.atZone(zoneId).toLocalDate())
    }
    maximumDate?.let {
      dialog.datePicker.maxDate = localDateAtSystemMillis(it.atZone(zoneId).toLocalDate())
    }

    dialog.show()
  }

  private fun openTimePicker() {
    val dialog =
        TimePickerDialog(
            context,
            { _, hourOfDay, minute ->
              val nextDateTime =
                  selectedDateTime
                      .withHour(hourOfDay)
                      .withMinute(minute)
                      .withSecond(0)
                      .withNano(0)

              selectedDateTime = clamp(nextDateTime)
              emitAndRefresh()
            },
            selectedDateTime.hour,
            selectedDateTime.minute,
            true,
        )

    dialog.show()
  }

  private fun applyDateSelection(localDate: LocalDate, continueWithTime: Boolean) {
    val nextDateTime =
        if (continueWithTime) {
          selectedDateTime
              .withYear(localDate.year)
              .withMonth(localDate.monthValue)
              .withDayOfMonth(localDate.dayOfMonth)
        } else {
          localDate.atStartOfDay(zoneId)
        }

    selectedDateTime = clamp(nextDateTime)

    if (continueWithTime) {
      openTimePicker()
    } else {
      emitAndRefresh()
    }
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
