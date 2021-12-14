package com.dropShadow;

import android.view.View;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Dynamic;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;


public class DropShadowModule extends ViewGroupManager<DropShadowLayout> {
    public static final String REACT_CLASS = "DropShadow";
    public DropShadowListener imageListener;

    @Override
    @NonNull
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected DropShadowLayout createViewInstance(ThemedReactContext reactContext) {
        final DropShadowLayout layout = new DropShadowLayout(reactContext);
        if (this.imageListener == null) this.imageListener = new DropShadowListener(reactContext);
        return layout;
    }

    @ReactProp(name = "shadowOffset")
    public void setShadowOffset(DropShadowLayout view, ReadableMap offsetMap) {
        view.setShadowOffset(offsetMap);
    }

    @ReactProp(name = "shadowColor")
    public void setShadowColor(DropShadowLayout view, Integer color) {
        view.setShadowColor(color);
    }

    @ReactProp(name = "shadowOpacity")
    public void setShadowOpacity(DropShadowLayout view, Dynamic opacity) {
        view.setShadowOpacity(opacity);
    }

    @ReactProp(name = "shadowRadius")
    public void setShadowRadius(DropShadowLayout view, Dynamic radius) {
        view.setShadowRadius(radius);
    }

    @Override
    public void addView(DropShadowLayout parent, View child, int index) {
        this.imageListener.onAddView(parent, child);
        super.addView(parent, child, index);
    }

    @Override
    public void onDropViewInstance(DropShadowLayout parent) {
        this.imageListener.tearDown();
    }
}
