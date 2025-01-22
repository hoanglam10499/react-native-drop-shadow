package com.dropshadow

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext

class DropShadowPackage : ReactPackage {
  override fun createViewManagers(
    reactContext: ReactApplicationContext
  ) = listOf(DropShadowModule())

  override fun createNativeModules(
    reactContext: ReactApplicationContext
  ): MutableList<NativeModule> = mutableListOf()
}
