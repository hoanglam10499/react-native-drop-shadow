package com.dropshadow

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.*
import android.graphics.BlurMaskFilter.Blur
import android.view.View
import android.view.ViewParent
import com.facebook.react.bridge.Dynamic
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.views.view.ReactViewGroup
import kotlin.math.roundToInt

class DropShadowLayout(context: Context) : ReactViewGroup(context) {
    private var color: Int = 0
    private var radius: Float = 0f
    private var opacity: Float = 0f
    private var dX: Float = 0f
    private var dY: Float = 0f
    private var x: Float = 0f
    private var y: Float = 0f

    private var shadow: Bitmap = Bitmap.createBitmap(1, 1, Bitmap.Config.ARGB_8888)
    private var content: Bitmap = Bitmap.createBitmap(1, 1, Bitmap.Config.ARGB_8888)
    private val paint: Paint = Paint(Paint.ANTI_ALIAS_FLAG)
    private val blurPaint: Paint = Paint(Paint.ANTI_ALIAS_FLAG)
    private val drawCanvas: Canvas = Canvas(content)

    private var contentDirty: Boolean = false
    private var shadowDirty: Boolean = false
    private var hasContent: Boolean = false
    private var hasOpacity: Boolean = false
    private var hasRadius: Boolean = false
    private var hasColor: Boolean = false
    private var hasArea: Boolean = false

    @Deprecated("Deprecated in Java")
    @Suppress("DEPRECATION")
    override fun invalidateChildInParent(location: IntArray, dirty: Rect?): ViewParent? {
        contentDirty = true
        shadowDirty = true
        return super.invalidateChildInParent(location, dirty)
    }

    override fun onDescendantInvalidated(child: View, target: View) {
        contentDirty = true
        shadowDirty = true
        super.onDescendantInvalidated(child, target)
        super.invalidate()
    }

    override fun invalidate() {
        contentDirty = true
        shadowDirty = true
        super.invalidate()
    }

    fun setShadowOffset(map: ReadableMap?) {
        if (map != null) {
            dX = if (map.hasKey("width")) map.getDouble("width").toFloat() else 0f
            dY = if (map.hasKey("height")) map.getDouble("height").toFloat() else 0f
        } else {
            dX = 0f
            dY = 0f
        }
        val density = resources.displayMetrics.density
        dX *= density
        dY *= density
        super.invalidate()
    }

    fun setShadowColor(color: Int?) {
        hasColor = color != null
        if (hasColor && this.color != color) {
            paint.color = color!!
            paint.alpha = (255 * opacity).roundToInt()
            this.color = color
        }
        super.invalidate()
    }

    fun setShadowOpacity(opacityDynamic: Dynamic?) {
        hasOpacity = opacityDynamic != null && !opacityDynamic.isNull
        val newOpacity = if (hasOpacity) opacityDynamic?.asDouble()?.toFloat() ?: 0f else 0f
        hasOpacity = hasOpacity && newOpacity > 0f
        if (hasOpacity && opacity != newOpacity) {
            paint.color = color
            paint.alpha = (255 * newOpacity).roundToInt()
            opacity = newOpacity
        }
        super.invalidate()
    }

    fun setShadowRadius(radiusDynamic: Dynamic?) {
        hasRadius = radiusDynamic != null && !radiusDynamic.isNull
        val rawRadius = if (hasRadius) radiusDynamic?.asDouble()?.toFloat() ?: 0f else 0f
        val scaledRadius = (rawRadius * 2) * resources.displayMetrics.density
        hasRadius = hasRadius && scaledRadius > 0f
        if (hasRadius && radius != scaledRadius) {
            blurPaint.maskFilter = BlurMaskFilter(scaledRadius, Blur.NORMAL)
            radius = scaledRadius
            shadowDirty = true
        }
        super.invalidate()
    }

    @SuppressLint("DrawAllocation")
    override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
        val width = MeasureSpec.getSize(widthMeasureSpec)
        val height = MeasureSpec.getSize(heightMeasureSpec)
        setMeasuredDimension(width, height)
        hasArea = width > 0 && height > 0
        if (hasArea) {
            if (content.width == width && content.height == height) {
                return
            }
            content.recycle()
            hasContent = false
            content = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
            drawCanvas.setBitmap(content)
        }
        invalidate()
    }

    override fun dispatchDraw(canvas: Canvas) {
        if (hasArea) {
            if (contentDirty) {
                if (hasContent) content.eraseColor(Color.TRANSPARENT)
                super.dispatchDraw(drawCanvas)
                contentDirty = false
                hasContent = true
            }
            if (hasColor && hasOpacity) {
                if (shadowDirty) {
                    shadow.recycle()
                    shadow = content.extractAlpha(blurPaint, null)
                    shadowDirty = false
                }
                x = dX - ((shadow.width - content.width) / 2).toFloat()
                y = dY - ((shadow.height - content.height) / 2).toFloat()
                canvas.drawBitmap(shadow, x, y, paint)
            }
            canvas.drawBitmap(content, 0f, 0f, null)
        }
        super.dispatchDraw(canvas)
    }
}
