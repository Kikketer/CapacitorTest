//
//  CognitoBridge.swift
//  App
//
//  Created by Weed, Chris on 2/8/19.
//

import AWSCognitoAuth
import Capacitor

@objc(CognitoPlugin)
public class CognitoPlugin: CAPPlugin, AWSCognitoAuthDelegate {
    public func getViewController() -> UIViewController {
        return self.bridge.viewController
    }
    
    @objc func echo(_ call: CAPPluginCall) {
        let value = call.getString("value") ?? ""
        call.resolve([
            "value": value
            ])
    }
    
    @objc func config(_ call: CAPPluginCall) {
        let appClientId = call.getString("appClientId") ?? "";
        let scopes = Set<String>(["openid", "email"]); // TODO
        let signInRedirectUri = call.getString("signInRedirectUri") ?? "";
        let signOutRedirectUri = call.getString("signOutRedirectUri") ?? "";
        let webDomain = call.getString("webDomain") ?? "";
        
        let config = AWSCognitoAuthConfiguration(appClientId: appClientId, appClientSecret: nil, scopes: scopes, signInRedirectUri: signInRedirectUri, signOutRedirectUri: signOutRedirectUri, webDomain: webDomain);
        
        AWSCognitoAuth.registerCognitoAuth(with: config, forKey: "AWSCognito")
        call.resolve()
    }
    
    @objc func getSession(_ call: CAPPluginCall) {
        let cognitoAuth = AWSCognitoAuth(forKey: "AWSCognito");
        cognitoAuth.delegate = self
        
        cognitoAuth.getSession(self.bridge.viewController) { (session, err) in
            if(err != nil) {
                NSLog(err.debugDescription)
                call.reject(err.debugDescription)
            } else {
                call.resolve([
                    "accessToken": session?.accessToken?.tokenString ?? ""])
            }
        }
    }
    
    @objc func signOut(_ call: CAPPluginCall) {
        let cognitoAuth = AWSCognitoAuth(forKey: "AWSCognito");
        cognitoAuth.delegate = self
        
        cognitoAuth.signOut { (err) in
            if(err != nil) {
                NSLog(err.debugDescription);
                call.reject(err.debugDescription);
            } else {
                call.resolve()
            }
        }
    }
    
    @objc func isSignedIn(_ call: CAPPluginCall) {
        let cognitoAuth = AWSCognitoAuth(forKey: "AWSCognito");
        
        call.resolve(["isSignedIn": cognitoAuth.isSignedIn]);
    }
}
