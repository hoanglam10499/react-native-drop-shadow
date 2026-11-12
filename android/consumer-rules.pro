# React Native discovers view properties through runtime annotations.
-keepattributes RuntimeVisibleAnnotations,AnnotationDefault
-keepclassmembers class com.dropshadow.DropShadowModule {
    @com.facebook.react.uimanager.annotations.ReactProp <methods>;
}
