@file:Suppress("INVISIBLE_MEMBER", "INVISIBLE_REFERENCE")

package com.dropshadow

import android.graphics.Paint
import com.facebook.react.bridge.DynamicFromObject
import com.facebook.react.internal.featureflags.ReactNativeFeatureFlags
import com.facebook.react.internal.featureflags.ReactNativeFeatureFlagsCxxAccessor
import com.facebook.react.internal.featureflags.ReactNativeFeatureFlagsLocalAccessor
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.RuntimeEnvironment
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [28])
class DropShadowLayoutTest {
  @Before
  fun setUp() {
    // Use RN's JVM test hook instead of loading Android feature-flag JNI.
    ReactNativeFeatureFlags.setAccessorProvider { ReactNativeFeatureFlagsLocalAccessor() }
  }

  @After
  fun tearDown() {
    ReactNativeFeatureFlags.setAccessorProvider { ReactNativeFeatureFlagsCxxAccessor() }
  }

  private fun field(view: DropShadowLayout, name: String): Any? {
    val field = DropShadowLayout::class.java.getDeclaredField(name)
    field.isAccessible = true
    return field.get(view)
  }

  @Test
  fun zeroAndRemovedRadiusClearThePreviousBlur() {
    val view = DropShadowLayout(RuntimeEnvironment.getApplication())
    val blurPaint = field(view, "blurPaint") as Paint

    for (reset in listOf(DynamicFromObject(0.0), DynamicFromObject(null), null)) {
      view.setShadowRadius(DynamicFromObject(8.0))
      assertNotNull(blurPaint.maskFilter)
      val dirty = DropShadowLayout::class.java.getDeclaredField("shadowDirty")
      dirty.isAccessible = true
      dirty.setBoolean(view, false)

      view.setShadowRadius(reset)

      assertNull(blurPaint.maskFilter)
      assertEquals(0f, field(view, "radius"))
      assertTrue(dirty.getBoolean(view))
    }
  }

  @Test
  fun colorAlphaAndOpacityCombineInEitherPropertyOrder() {
    val color = 0x80123456.toInt()
    val colorFirst = DropShadowLayout(RuntimeEnvironment.getApplication())
    colorFirst.setShadowColor(color)
    colorFirst.setShadowOpacity(DynamicFromObject(0.5))
    assertEquals(64, (field(colorFirst, "paint") as Paint).alpha)

    val opacityFirst = DropShadowLayout(RuntimeEnvironment.getApplication())
    opacityFirst.setShadowOpacity(DynamicFromObject(0.5))
    opacityFirst.setShadowColor(color)
    assertEquals(64, (field(opacityFirst, "paint") as Paint).alpha)

    colorFirst.setShadowColor(0xff123456.toInt())
    assertEquals(128, (field(colorFirst, "paint") as Paint).alpha)
    colorFirst.setShadowOpacity(DynamicFromObject(1.0))
    assertEquals(255, (field(colorFirst, "paint") as Paint).alpha)
  }
}
