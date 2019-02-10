package com.testthing.myapp

import com.getcapacitor.JSObject
import com.getcapacitor.NativePlugin
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod

@NativePlugin
class CognitoPlugin : Plugin() {

    @PluginMethod
    fun config(call: PluginCall) {
        call.resolve()
    }

    @PluginMethod
    fun getSession(call: PluginCall) {
        call.resolve()
    }

    @PluginMethod
    fun isSignedIn(call: PluginCall) {
        call.resolve()
    }

    @PluginMethod
    fun signOut(call: PluginCall) {
        call.resolve()
    }
}
