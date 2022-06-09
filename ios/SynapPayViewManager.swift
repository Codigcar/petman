//
//  SynapPayViewManager.swift
//  SynapPayShop
//
//  Created by Javier Alberto Perez Valdez on 10/21/20.
//
import UIKit

@objc(SynapPayViewManager)
class SynapPayViewManager : RCTViewManager {
  override func view() -> UIView! {
    let view=SynapPayView();
    return view;
  }
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  @objc
  func create(_ node: NSNumber, themeName: NSString, environmentName:NSString) {
    DispatchQueue.main.async {
      let component = self.bridge.uiManager.view(
        forReactTag: node
      ) as! SynapPayView
      component.create(themeName as String, environmentName as String)
    }
  }
  
  @objc
  func createWithBanks(_ node: NSNumber) {
    DispatchQueue.main.async {
      let component = self.bridge.uiManager.view(
        forReactTag: node
      ) as! SynapPayView
      component.createWithBanks()
    }
  }
  @objc
  func configure(_ node: NSNumber, identifier: NSString, onBehalf:NSString, signature:NSString, transaction:NSString) {
    DispatchQueue.main.async {
      let component = self.bridge.uiManager.view(
        forReactTag: node
      ) as! SynapPayView
      component.configure(
        identifier as String,
        onBehalf as String,
        signature as String,
        transaction as String)
    }
  }
  
  @objc
  func pay(_ node: NSNumber) {
    DispatchQueue.main.async {
      let component = self.bridge.uiManager.view(
        forReactTag: node
      ) as! SynapPayView
      component.pay()
    }
  }
  
}
