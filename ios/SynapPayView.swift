import Foundation
import UIKit
import SynapPay

class SynapPayView : UIView {
  var jsonEncoder = JSONEncoder()
  var jsonDecoder = JSONDecoder()
  
  //ReactNative Properties
  var themeName: String = "";
  var environmentName: String = "";
  
  var identifier: String = "";
  var onBehalf: String = "";
  var signature: String = "";
  var transaction: SynapTransaction = SynapTransaction();
  
  //ReactNative Events
  @objc var onCreateStarted: RCTDirectEventBlock?
  @objc var onCreateCompleted: RCTDirectEventBlock?
  @objc var onConfigureStarted: RCTDirectEventBlock?
  @objc var onConfigureCompleted: RCTDirectEventBlock?
  @objc var onPayStarted: RCTDirectEventBlock?
  @objc var onPaySuccess: RCTDirectEventBlock?
  @objc var onPayFail: RCTDirectEventBlock?
  @objc var onPayCompleted: RCTDirectEventBlock?
  @objc var onError: RCTDirectEventBlock?
  @objc var onLog: RCTDirectEventBlock?
  
  var payButton: SynapPayButton!
  override init(frame: CGRect) {
    super.init(frame: frame)
  }
  
  required init?(coder aDecoder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
  
  func create(_ themeName: String, _ environmentName:String) {
    
    self.themeName = themeName;
    self.environmentName = environmentName;
    self.notityEvent(self.onLog, "message", "themeName: " + self.themeName)
    self.notityEvent(self.onLog, "message", "environmentName: " + self.environmentName)
    
    self.notityEvent(self.onCreateStarted, "message", "OK");
    SynapPayButton.setTheme(SynapLightTheme())
    if( self.themeName == "dark"){
      SynapPayButton.setTheme(SynapDarkTheme())
    }
    
    switch self.environmentName.uppercased() {
    case "SANDBOX":
      SynapPayButton.setEnvironment(.sandbox)
    case "DEVELOPMENT":
      SynapPayButton.setEnvironment(.development)
    case "PRODUCTION":
      SynapPayButton.setEnvironment(.production)
    case "LOCAL":
      SynapPayButton.setEnvironment(.local)
    default:
      SynapPayButton.setEnvironment(.production)
    }
    
    self.payButton = SynapPayButton.create(view: self)
    
    self.notityEvent(self.onCreateCompleted, "message", "OK");
    
  }
  
  func createWithBanks() {
    
  }
  
  func configure(_ identifier: String, _ onBehalf:String, _ signature:String, _ transaction:String) {
    
    
    self.identifier = identifier;
    self.onBehalf = onBehalf;
    self.signature = signature;
    let data = transaction.data(using: .utf8)!;
    self.transaction = self.decode(SynapTransaction.self, from: data)!;
    
    self.notityEvent(self.onLog, "message", "identifier: " + self.identifier)
    self.notityEvent(self.onLog, "message", "onBehalf: " + self.onBehalf)
    self.notityEvent(self.onLog, "message", "signature: " + self.signature)
    self.notityEvent(self.onLog, "message", "transaction: " + transaction)
    
    self.notityEvent(self.onConfigureStarted, "message", "OK");
    
    var authenticator = SynapAuthenticator();
    authenticator.identifier = self.identifier
    if(onBehalf != ""){
      authenticator.onBehalf = self.onBehalf
    }
    authenticator.signature = self.signature
    self.payButton.configure(
      authenticator: authenticator,
      transaction: self.transaction,
      success: {
        (response) in
        let responseString = self.encodeAsString(response);
        self.notityEvent(self.onPaySuccess, "response", responseString);
        self.notityEvent(self.onPayCompleted, "message", "OK");
      },
      failed: {
        (response) in
        let responseString = self.encodeAsString(response);
        self.notityEvent(self.onPayFail, "response", responseString);
        self.notityEvent(self.onPayCompleted, "message", "OK");
      }
    )
    
    self.notityEvent(self.onConfigureCompleted, "message", "OK");
    
  }
  
  func pay() {
    self.notityEvent(self.onPayStarted, "message", "OK");
    self.payButton.pay()
  }
  
  func encode<T>(_ value: T) -> Data? where T : Encodable{
    var jsonData:Data?
    do {
      jsonData = try jsonEncoder.encode(value)
    } catch { print(error) }
    return jsonData
  }
  
  func encodeAsString<T>(_ value: T) -> String where T : Encodable{
    let data = encode(value)
    let jsonData=String(data: data!, encoding: .utf8)!
    return jsonData
  }
  
  func decode<T>(_ type: T.Type, from data: Data) -> T? where T : Decodable{
    var response:T?
    do{
      response = try self.jsonDecoder.decode(type, from: data)
    } catch { print(error) }
    return response
  }
  
  func notityEvent(_ event:RCTDirectEventBlock?, _ argName:String, _ argValue: String){
    if event != nil {
      event!([argName: argValue])
    }
  }
}
