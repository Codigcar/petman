package com.petman.bridges.views;

import android.content.Context;
import android.view.View;
import android.view.ViewGroup;

import androidx.constraintlayout.widget.ConstraintLayout;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.synap.pay.SynapPayButton;
import com.synap.pay.handler.EventHandler;
import com.synap.pay.handler.payment.SynapAuthorizeHandler;
import com.synap.pay.model.payment.SynapTransaction;
import com.synap.pay.model.payment.response.SynapAuthorizeResponse;
import com.synap.pay.model.security.SynapAuthenticator;
import com.synap.pay.theming.SynapDarkTheme;
import com.synap.pay.theming.SynapLightTheme;
import com.synap.pay.theming.SynapTheme;
import com.synap.pay.util.json.JSONDecoder;
import com.synap.pay.util.json.JSONEncoder;
import com.petman.bridges.events.SynapPayViewEvent;

public class SynapPayView extends ConstraintLayout {

    private SynapPayButton payButton;
    private String themeName;
    private String environmentName;
    private SynapTransaction transaction;
    private String identifier;
    private String onBehalf;
    private String signature;

    public SynapPayView(Context context) {
        super(context);
        LayoutParams layoutParams = new LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
        this.setLayoutParams(layoutParams);
    }

    public void create(String themeName, String environmentName) {
        this.createWidget(themeName, environmentName, Boolean.FALSE);
    }

    public void createWithBanks(String themeName, String environmentName) {
        this.createWidget(themeName, environmentName, Boolean.TRUE);
    }

    public void configure(String identifier, String onBehalf, String signature, String transaction) {
        String message = "OK";
        try {
            this.identifier = identifier;
            this.onBehalf = onBehalf;
            this.signature = signature;
            this.transaction = JSONDecoder.decode(SynapTransaction.class, transaction);
            this.notifyEvent(SynapPayViewEvent.LOG, "identifier" + this.identifier);
            this.notifyEvent(SynapPayViewEvent.LOG, "onBehalf" + this.onBehalf);
            this.notifyEvent(SynapPayViewEvent.LOG, "signature" + this.signature);
            this.notifyEvent(SynapPayViewEvent.LOG, "transaction" + transaction);

            this.notifyEvent(SynapPayViewEvent.CONFIGURE_STARTED, message);
            if (this.identifier == null) {
                throw new RuntimeException("[identifier] es requerido");
            }
            if (this.signature == null) {
                throw new RuntimeException("[signature] es requerido");
            }
            if (this.transaction == null) {
                throw new RuntimeException("[transaction] es requerido");
            }
            SynapAuthenticator authenticator = new SynapAuthenticator();
            authenticator.setIdentifier(this.identifier);
            if(this.onBehalf!=null && !this.onBehalf.equals("")){
                authenticator.setOnBehalf(this.onBehalf);
            }
            authenticator.setSignature(this.signature);
            this.refreshLayout();
            this.payButton.configure(
                    authenticator,
                    this.transaction,
                    new SynapAuthorizeHandler() {
                        @Override
                        public void success(SynapAuthorizeResponse response) {
                            String responseString = JSONEncoder.encode(response);
                            notifyEvent(SynapPayViewEvent.PAY_SUCCESS, responseString);
                            notifyEvent(SynapPayViewEvent.PAY_COMPLETED, "OK");
                        }

                        @Override
                        public void failed(SynapAuthorizeResponse response) {
                            String responseString = JSONEncoder.encode(response);
                            notifyEvent(SynapPayViewEvent.PAY_FAIL, responseString);
                            notifyEvent(SynapPayViewEvent.PAY_COMPLETED, "FAIL");
                        }
                    });
            this.refreshLayout();
            this.notifyEvent(SynapPayViewEvent.CONFIGURE_COMPLETED, message);
        } catch (Exception e) {
            this.notifyEvent(SynapPayViewEvent.ERROR, e.getMessage());
        }
    }

    private void createWidget(String themeName, String environmentName, Boolean withBanks) {
        try {
            this.themeName = themeName;
            this.environmentName = environmentName;
            this.notifyEvent(SynapPayViewEvent.LOG, "themeName" + this.themeName);
            this.notifyEvent(SynapPayViewEvent.LOG, "environmentName" + this.environmentName);
            this.notifyEvent(SynapPayViewEvent.CREATE_STARTED, "OK");
            SynapTheme theme = new SynapLightTheme();
            if ("dark".equals(this.themeName)) {
                theme = new SynapDarkTheme();
            }
            SynapPayButton.setTheme(theme);
            if (this.environmentName != null) {
                switch (this.environmentName.toUpperCase()) {
                    case "SANDBOX":
                        SynapPayButton.setEnvironment(SynapPayButton.Environment.SANDBOX);
                        break;
                    case "DEVELOPMENT":
                        SynapPayButton.setEnvironment(SynapPayButton.Environment.DEVELOPMENT);
                        break;
                    case "PRODUCTION":
                        SynapPayButton.setEnvironment(SynapPayButton.Environment.PRODUCTION);
                        break;
                    case "LOCAL":
                        SynapPayButton.setEnvironment(SynapPayButton.Environment.LOCAL);
                        break;
                    default:
                        SynapPayButton.setEnvironment(SynapPayButton.Environment.PRODUCTION);
                        break;
                }
            }

            SynapPayButton.setListener(new EventHandler() {
                @Override
                public void onEvent(SynapPayButton.Events event) {

                    switch (event) {
                        case START_PAY:
                            notifyEvent(SynapPayViewEvent.PAY_STARTED, "OK");
                            break;
                        case INVALID_CARD_FORM:
                            notifyEvent(SynapPayViewEvent.FORM_INVALID, "FormInvalid");
                            break;
                        case VALID_CARD_FORM:
                            notifyEvent(SynapPayViewEvent.FORM_VALID, "OK");
                            break;
                        case CARDSTORAGE_LOADED:
                            refreshLayout();
                            break;
                    }
                }
            });

            if (withBanks) {
                this.payButton = SynapPayButton.createWithBanks(this);
            } else {
                this.payButton = SynapPayButton.create(this);
            }

            this.refreshLayout();
            this.notifyEvent(SynapPayViewEvent.CREATE_COMPLETED, "OK");
        } catch (Exception e) {
            this.notifyEvent(SynapPayViewEvent.ERROR, e.getMessage());
        }
    }

    private void refreshLayout() {
        View view=this;
        view.measure(
                View.MeasureSpec.makeMeasureSpec(view.getMeasuredWidth(), View.MeasureSpec.EXACTLY),
                View.MeasureSpec.makeMeasureSpec(view.getMeasuredHeight(), View.MeasureSpec.EXACTLY));
        view.layout(view.getLeft(), view.getTop(), view.getRight(), view.getBottom());
    }

    public void pay() {
        try {
            this.payButton.pay();
            this.refreshLayout();
        } catch (Exception e) {
            this.notifyEvent(SynapPayViewEvent.ERROR, e.getMessage());
        }
    }

    private void notifyEvent(SynapPayViewEvent event, String... values) {
        if (event.getParameters().size() != values.length) {
            throw new RuntimeException("Invalid parameter values size for event notify");
        }
        WritableMap eventMap = Arguments.createMap();
        for (int i = 0; i < event.getParameters().size(); i++) {
            String parameter = event.getParameters().get(i);
            eventMap.putString(parameter, values[i]);
        }
        ReactContext reactContext = (ReactContext) getContext();
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
                getId(),
                event.getName(),
                eventMap);
    }
}
