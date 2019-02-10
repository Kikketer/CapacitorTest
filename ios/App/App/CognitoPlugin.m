//
//  CognitoPlugin.m
//  App
//
//  Created by Weed, Chris on 2/8/19.
//

#import <Capacitor/Capacitor.h>

CAP_PLUGIN(CognitoPlugin, "CognitoPlugin",
           CAP_PLUGIN_METHOD(echo, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(config, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(getSession, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(signOut, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(isSignedIn, CAPPluginReturnPromise);
           )
