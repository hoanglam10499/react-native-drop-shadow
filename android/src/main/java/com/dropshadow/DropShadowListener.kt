package com.dropshadow

import android.os.CountDownTimer
import android.view.View
import android.view.ViewGroup
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.UiThreadUtil
import com.facebook.react.uimanager.UIManagerModule
import com.facebook.react.uimanager.events.Event
import com.facebook.react.uimanager.events.EventDispatcher
import com.facebook.react.uimanager.events.EventDispatcherListener
import com.facebook.react.views.image.ReactImageView
import com.facebook.react.views.view.ReactViewGroup
import java.util.ArrayList
import java.util.HashMap

class DropShadowListener(private val reactContext: ReactContext) : EventDispatcherListener {

  private val imageIds = HashMap<Int, DropShadowLayout>()
  private val viewsToFadeIn = ArrayList<DropShadowLayout>()
  private val eventDispatcher: EventDispatcher? =
    reactContext.getNativeModule(UIManagerModule::class.java)?.eventDispatcher
  private var fadeTimer: CountDownTimer? = null

  init {
    eventDispatcher?.addListener(this)
  }

  fun onAddView(parent: DropShadowLayout, child: View) {
    when (child) {
      is ReactImageView -> {
        child.setShouldNotifyLoadEvents(true)
        imageIds[child.id] = parent
      }

      is ReactViewGroup -> {
        for (index in 0 until child.childCount) {
          val nextChild = child.getChildAt(index)
          onAddView(parent, nextChild)
        }
      }
    }
  }

  override fun onEventDispatch(event: Event<*>) {
    if (UiThreadUtil.isOnUiThread()) {
      handleEvent(event)
    } else {
      UiThreadUtil.runOnUiThread { handleEvent(event) }
    }
  }

  private fun handleEvent(event: Event<*>) {
    if (event.eventName == "topLoadEnd" && imageIds.containsKey(event.viewTag)) {
      val layout = imageIds[event.viewTag]
      layout?.let { viewsToFadeIn.add(it) }
      fadeTimer?.cancel()
      fadeTimer = object : CountDownTimer(500, 33) {
        override fun onTick(millisUntilFinished: Long) {
          for (view in viewsToFadeIn) view.invalidate()
        }

        override fun onFinish() {
          for (view in viewsToFadeIn) view.invalidate()
          viewsToFadeIn.clear()
        }
      }.start()
    }
  }

  fun tearDown() {
    eventDispatcher?.removeListener(this)
  }
}
