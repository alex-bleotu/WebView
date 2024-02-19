import axios from "axios";
import { forwardRef, useImperativeHandle, useState } from "react";
import { Modal, View } from "react-native";
import WebView from "react-native-webview";
import { html } from "../../html";
import { createBody, createRequestBody } from "./utils";

interface PaymentProcessorProps {
    onPaymentSuccess: () => void;
    onPaymentFailure: (error: Error) => void;
}

export interface PaymentProcessorRef {
    initiatePayment: (
        cardExpiryMonth: string,
        cardExpiryYear: string,
        cardNumber: string,
        cardHolderName: string,
        purchaseAmount: string
    ) => Promise<void>;
}

const PaymentProcessor = forwardRef<PaymentProcessorRef, PaymentProcessorProps>(
    ({ onPaymentSuccess, onPaymentFailure }, ref) => {
        const [showChallenge, setShowChallenge] = useState(false);
        const [challengeHTML, setChallengeHTML] = useState("");
        const [browserInfo, setBrowserInfo] = useState<any>(null);
        const [isLoading, setIsLoading] = useState(true);

        const handleMessage = (event: any) => {
            setBrowserInfo(JSON.parse(event.nativeEvent.data));
            setIsLoading(false);
        };

        useImperativeHandle(ref, () => ({
            initiatePayment: async (
                cardExpiryMonth: string,
                cardExpiryYear: string,
                cardNumber: string,
                cardHolderName: string,
                purchaseAmount: string
            ) => {
                try {
                    const body = createRequestBody(
                        createBody(
                            browserInfo,
                            cardExpiryMonth,
                            cardExpiryYear,
                            cardNumber,
                            cardHolderName,
                            purchaseAmount
                        ),
                        "WORLDPAY_INTERNETUSD"
                    );

                    axios
                        .post(
                            "https://www.threedsecurempi.com/EMVTDS/API/AREQ",
                            body
                        )
                        .then((response) => {
                            const message = JSON.parse(response.data.message);
                            if (message.transStatus === "Y") {
                                setShowChallenge(false);
                                onPaymentSuccess();
                            } else if (message.transStatus === "N") {
                                setShowChallenge(false);
                                onPaymentFailure(new Error("Payment rejected"));
                            } else if (message.transStatus === "C") {
                                setChallengeHTML(html);
                                setShowChallenge(true);

                                console.log({
                                    messageVersion: "2.2.0.1.0",
                                    threeDSServerTransID:
                                        message.threeDSServerTransID,
                                    acsTransID: message.acsTransID,
                                    messageType: "CReq",
                                    challengeWindowSize: "05",
                                    messageCategory: "01",
                                    browserInfo: browserInfo,
                                });

                                axios
                                    .post(message.acsURL, {
                                        messageVersion: "2.2.0.1.0",
                                        threeDSServerTransID:
                                            message.threeDSServerTransID,
                                        acsTransID: message.acsTransID,
                                        messageType: "CReq",
                                        challengeWindowSize: "05",
                                        messageCategory: "01",
                                        browserInfo: browserInfo,
                                    })
                                    .then((response) => {
                                        console.log(response.data);
                                    })
                                    .catch((error) => {
                                        console.log(error);
                                    });
                            } else {
                                onPaymentFailure(new Error("Payment failed"));
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            setChallengeHTML(html);
                            setShowChallenge(true);
                        });
                } catch (error: any) {
                    onPaymentFailure(error);
                }
            },
        }));

        if (isLoading)
            return (
                <View
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "transparent",
                        zIndex: -5,
                    }}>
                    <WebView
                        style={{
                            backgroundColor: "transparent",
                            height: 1,
                            width: 1,
                            zIndex: -5,
                        }}
                        source={{
                            html: "",
                        }}
                        pointerEvents="none"
                        injectedJavaScript={`   
                        async function getAndPostBrowserInfo() {
                            const response = await fetch('https://api.ipify.org?format=json');
                            const data = await response.json();
                            
                            const browserInfo = {
                                browserAcceptHeader: navigator.acceptHeader || "*/*",
                                browserIP: data.ip, // You need to replace this with actual IP fetching logic
                                browserJavaEnabled: navigator.javaEnabled ? navigator.javaEnabled() : false,
                                browserLanguage: navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage || 'en',
                                browserColorDepth: window.screen.colorDepth || 24,
                                browserScreenHeight: window.screen.height || 0,
                                browserScreenWidth: window.screen.width || 0,
                                browserTZ: new Date().getTimezoneOffset() / -60 || 0,
                                browserUserAgent: navigator.userAgent || ''
                            };

                            window.ReactNativeWebView.postMessage(JSON.stringify(browserInfo));
                        }

                        getAndPostBrowserInfo();
                    `}
                        onMessage={handleMessage}
                    />
                </View>
            );

        return (
            <Modal
                visible={showChallenge}
                onRequestClose={() => setShowChallenge(false)}>
                <WebView
                    source={{ html: challengeHTML }}
                    onNavigationStateChange={(event) => {
                        if (event.url.includes("challenge-completed")) {
                            setShowChallenge(false);
                            onPaymentSuccess();
                        }
                    }}
                />
            </Modal>
        );
    }
);

export default PaymentProcessor;
