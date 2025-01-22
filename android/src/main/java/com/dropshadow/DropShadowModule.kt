package com.dropshadow

import android.view.View
import com.facebook.react.bridge.Dynamic
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.annotations.ReactProp

@ReactModule(name = DropShadowModule.NAME)
class DropShadowModule :
  ViewGroupManager<DropShadowLayout>() {

  override fun getName(): String {
    return NAME
  }

  companion object {
    const val NAME = "DropShadow"
  }

  var imageListener: DropShadowListener? = null

  override fun createViewInstance(reactContext: ThemedReactContext): DropShadowLayout {
    val layout = DropShadowLayout(reactContext)
    if (imageListener == null) {
      imageListener = DropShadowListener(reactContext)
    }
    return layout
  }

  @ReactProp(name = "shadowOffset")
  fun setShadowOffset(view: DropShadowLayout, offsetMap: ReadableMap) {
    view.setShadowOffset(offsetMap)
  }

  @ReactProp(name = "shadowColor")
  fun setShadowColor(view: DropShadowLayout, color: Int?) {
    view.setShadowColor(color)
  }

  @ReactProp(name = "shadowOpacity")
  fun setShadowOpacity(view: DropShadowLayout, opacity: Dynamic) {
    view.setShadowOpacity(opacity)
  }

  @ReactProp(name = "shadowRadius")
  fun setShadowRadius(view: DropShadowLayout, radius: Dynamic) {
    view.setShadowRadius(radius)
  }

  override fun addView(parent: DropShadowLayout, child: View, index: Int) {
    imageListener?.onAddView(parent, child)
    super.addView(parent, child, index)
  }

  override fun onDropViewInstance(parent: DropShadowLayout) {
    imageListener?.tearDown()
  }
}

