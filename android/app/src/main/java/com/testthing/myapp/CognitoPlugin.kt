package com.testthing.myapp

import com.amazonaws.mobileconnectors.cognitoauth.Auth
import com.amazonaws.mobileconnectors.cognitoauth.AuthUserSession
import com.amazonaws.mobileconnectors.cognitoauth.handlers.AuthHandler
import com.getcapacitor.JSObject
import com.getcapacitor.NativePlugin
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
//import com.testthing.myapp.cognito

@NativePlugin
class CognitoPlugin : Plugin() {

    private var jwt: String? = null
    private var signInInProgress = false
    private var getSessionPromise:Promise? = null
    private var cognitoAuth:Auth? = null

    @PluginMethod
    fun config(call: PluginCall) {
        val appClientId = call.getString("appClientId")
        val signIn = call.getString("signInRedirectUri")
        val signOut = call.getString("signOutRedirectUri")
        val webDomain = call.getString("webDomain")
        val scopes = arrayOf("email", "openid")
        val builder = Auth.Builder()
                .setApplicationContext(context)
                .setAppClientId(appClientId)
                .setAppCognitoWebDomain(webDomain)
                .setSignInRedirect(signIn)
                .setSignOutRedirect(signOut)
                .setScopes(scopes as MutableSet<String>?)

        builder.setAuthHandler(TheAuthHandler())
        cognitoAuth = builder.build()

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

    internal inner class TheAuthHandler : AuthHandler {
        override fun onSuccess(session: AuthUserSession) {
            // This will invoked to return tokens on successful authentication or when valid tokens are available locally.
            // 'session' will contain valid tokens for the user.
//            Timber.e("Success")
            jwt = session.accessToken.jwtToken
            signInInProgress = false
            val map = Arguments.createMap()
            map.putString("session", jwt)
            // Resolve the global promise with the jwt
            getSessionPromise?.resolve(map)
            getSessionPromise = null
//            Timber.e("jwt: %s", jwt)
        }

        override fun onSignout() {
//            Timber.e("Signed out")
            signInInProgress = false
        }

        override fun onFailure(e: Exception) {
//            Timber.e("Failure Message: %s", e.localizedMessage)
//            Timber.e("Failure Stack Trace:")
            e.printStackTrace()
            getSessionPromise?.reject(e)
            getSessionPromise = null
        }

    }
}
