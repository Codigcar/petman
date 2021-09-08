//
//  SynapPayViewManager.m
//  SynapPayShop
//
//  Created by Javier Alberto Perez Valdez on 10/21/20.
//

#import <Foundation/Foundation.h>
#import "React/RCTViewManager.h"
#import <React/RCTUIManager.h>
#import <React/RCTLog.h>

@interface RCT_EXTERN_MODULE(SynapPayViewManager, RCTViewManager)
//Commands
RCT_EXTERN_METHOD(
                  create: (nonnull NSNumber *)node
                  themeName:(nonnull NSString *)themeName
                  environmentName: (nonnull NSString *) environmentName
                  )
RCT_EXTERN_METHOD(createWithBanks:(nonnull NSNumber *) node)
RCT_EXTERN_METHOD(
                  configure:(nonnull NSNumber *) node
                  identifier:(nonnull NSString *)identifier
                  onBehalf:(nonnull NSString *)onBehalf
                  signature:(nonnull NSString *)signature
                  transaction:(nonnull NSString *)transaction
                  )

RCT_EXTERN_METHOD(pay:(nonnull NSNumber *) node)

//Events
RCT_EXPORT_VIEW_PROPERTY(onCreateStarted, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onCreateCompleted, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onConfigureStarted, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onConfigureCompleted, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onPayStarted, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onPaySuccess, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onPayFail, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onPayCompleted, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onError, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onLog, RCTDirectEventBlock)

@end
