package com.testthing.myapp

import android.content.Context
import com.amazonaws.mobileconnectors.cognitoauth.Auth
import com.amazonaws.mobileconnectors.cognitoauth.AuthUserSession
import com.amazonaws.mobileconnectors.cognitoauth.handlers.AuthHandler

object AWSCognitoSingle {
    private var jwt: String? = null
    private var signInInProgress = false
    private var getSessionPromise:Promise? = null

//    fun getByKey(keyName: String) {
//
//    }

    fun config(appContext: Context, appClientId: String, signInRedirectUri: String, signOutRedirectUri: String, webDomain: String): Promise {
//        val appClientId = call.getString("appClientId")
//        val signIn = call.getString("signInRedirectUri")
//        val signOut = call.getString("signOutRedirectUri")
//        val webDomain = call.getString("webDomain")
        val scopes = arrayOf("email", "openid") // TODO
        val builder = Auth.Builder()
                .setApplicationContext(appContext)
                .setAppClientId(appClientId)
                .setAppCognitoWebDomain(webDomain)
                .setSignInRedirect(signInRedirectUri)
                .setSignOutRedirect(signOutRedirectUri)
                .setScopes(scopes as MutableSet<String>?)

        builder.setAuthHandler(TheAuthHandler)
    }

    internal object TheAuthHandler : AuthHandler {
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
            Timber.e("jwt: %s", jwt)
        }

        override fun onSignout() {
            Timber.e("Signed out")
            signInInProgress = false
        }

        override fun onFailure(e: Exception) {
            Timber.e("Failure Message: %s", e.localizedMessage)
            Timber.e("Failure Stack Trace:")
            e.printStackTrace()
            getSessionPromise?.reject(e)
            getSessionPromise = null
        }

    }
}