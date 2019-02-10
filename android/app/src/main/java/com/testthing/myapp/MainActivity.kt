package com.testthing.myapp

import android.os.Bundle

import com.getcapacitor.BridgeActivity
import com.getcapacitor.Plugin
import com.testthing.myapp.CognitoPlugin

import java.util.ArrayList

class MainActivity : BridgeActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Initializes the Bridge
        this.init(savedInstanceState, object : ArrayList<Class<out Plugin>>() {
            init {
                // Additional plugins you've installed go here
                // Ex: add(TotallyAwesomePlugin.class);
                add(CognitoPlugin::class.java)
            }
        })
    }
}
