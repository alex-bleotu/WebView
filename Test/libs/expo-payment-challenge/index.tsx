import axios from "axios";
import { decode, encode } from "base-64";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Modal, Text, TouchableNativeFeedback, View } from "react-native";
import WebView from "react-native-webview";
import { html } from "./html";
import { createBody, createRequestBody, notificationDefaultURL } from "./utils";

interface PaymentProcessorProps {
    onPaymentSuccess: () => void;
    onPaymentFailure: (error: Object) => void;
    onPaymentCancel?: () => void;
    onRReqReceived?: (rReq: Object) => void;
    onError?: (error: Error) => void;
    merchantIdentifier: string;
    backgroundColor?: string;
    header?: string;
    notificationURL?: string;
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
    (
        {
            onPaymentSuccess,
            onPaymentFailure,
            onPaymentCancel,
            onRReqReceived,
            onError,
            backgroundColor = "#009a97",
            header = "Secure Checkout",
            merchantIdentifier,
            notificationURL,
        },
        ref
    ) => {
        const [showChallenge, setShowChallenge] = useState(false);
        const [challengeHTML, setChallengeHTML] = useState("");
        const [browserInfo, setBrowserInfo] = useState<any>(null);
        const [isLoading, setIsLoading] = useState(true);
        const [cres, setCres] = useState("");
        const [currentLink, setCurrentLink] = useState("");

        useEffect(() => {
            const rReq = () => {
                if (
                    currentLink ===
                        (notificationURL || notificationDefaultURL) &&
                    cres !== "" &&
                    showChallenge
                ) {
                    setShowChallenge(false);
                    setChallengeHTML("");

                    if (cres === "Error") {
                        onError &&
                            onError(
                                new Error(
                                    "Notification URL did not return CRes"
                                )
                            );
                        return;
                    }
                    const decodedCres = JSON.parse(decode(cres));

                    axios
                        .post(
                            "https://www.threedsecurempi.com/EMVTDS/API/CRES",
                            {
                                api: {
                                    version: "2.1.0",
                                    istestcard: true, // TODO: change this to false in production
                                    isPIT: false,
                                    compressed: false,
                                },
                                messageType: "CRes",
                                message: JSON.stringify(decodedCres),
                            }
                        )
                        .then((response: any) => {
                            onRReqReceived &&
                                onRReqReceived(
                                    JSON.parse(response.data.message)
                                );
                        });

                    if (decodedCres.transStatus === "Y") onPaymentSuccess();
                    else if (decodedCres.transStatus === "N")
                        onPaymentFailure(decodedCres);
                }
            };

            rReq();
        }, [currentLink, cres]);

        useImperativeHandle(ref, () => ({
            initiatePayment: async (
                cardExpiryMonth: string,
                cardExpiryYear: string,
                cardNumber: string,
                cardHolderName: string,
                purchaseAmount: string
            ) => {
                setCres("");
                try {
                    const body = createRequestBody(
                        createBody(
                            browserInfo,
                            cardExpiryMonth,
                            cardExpiryYear,
                            cardNumber,
                            cardHolderName,
                            purchaseAmount,
                            notificationURL || notificationDefaultURL
                        ),
                        merchantIdentifier
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
                                onPaymentFailure(message);
                            } else if (message.transStatus === "C") {
                                let challenge = html;
                                challenge = challenge.replace(
                                    "[acsurl]",
                                    message.acsURL
                                );

                                challenge = challenge.replace(
                                    "[creqjson]",
                                    encode(
                                        JSON.stringify({
                                            messageVersion: "2.1.0",
                                            threeDSServerTransID:
                                                message.threeDSServerTransID,
                                            acsTransID: message.acsTransID,
                                            messageType: "CReq",
                                            challengeWindowSize: "04",
                                            messageCategory: "01",
                                        })
                                    )
                                        .replace(/\+/g, "-")
                                        .replace(/\//g, "_")
                                        .replace(/=+$/, "")
                                );

                                setChallengeHTML(challenge);
                                setShowChallenge(true);
                            } else {
                                onPaymentFailure(message);
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
                        onMessage={(event: any) => {
                            setBrowserInfo(JSON.parse(event.nativeEvent.data));
                            setIsLoading(false);
                        }}
                    />
                </View>
            );

        return (
            <Modal
                statusBarTranslucent={true}
                visible={showChallenge}
                onRequestClose={() => setShowChallenge(false)}>
                <View
                    style={{
                        height: 80,
                        backgroundColor,
                        alignItems: "center",
                        paddingHorizontal: 20,
                        paddingTop: 25,
                        flexDirection: "row",
                    }}>
                    <Text
                        style={{
                            color: "white",
                            fontWeight: "600",
                            fontSize: 20,
                        }}>
                        {header}
                    </Text>
                    <View
                        style={{
                            marginLeft: "auto",
                            overflow: "hidden",
                        }}>
                        <TouchableNativeFeedback
                            onPress={() => {
                                setShowChallenge(false);
                                setChallengeHTML("");
                                onPaymentCancel && onPaymentCancel();
                            }}
                            background={TouchableNativeFeedback.Ripple(
                                "rgba(255, 255, 255, 0.3)",
                                false
                            )}>
                            <View
                                style={{
                                    paddingHorizontal: 20,
                                    paddingVertical: 5,
                                    marginRight: -5,
                                }}>
                                <Text
                                    style={{
                                        color: "white",
                                        fontWeight: "600",
                                        fontSize: 18,
                                        marginTop: 2,
                                    }}>
                                    Cancel
                                </Text>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                </View>
                <WebView
                    source={{ html: challengeHTML }}
                    injectedJavaScript={`
                        (function() {
                        var targetURL = '${
                            notificationURL || notificationDefaultURL
                        }';
                        var currentURL = window.location.href;
                        if (currentURL === targetURL) {
                            var cresBase64 = document.querySelector('.ex1') ? document.querySelector('.ex1').innerText : '';
                            if (cresBase64) {
                            window.ReactNativeWebView.postMessage(JSON.stringify({type: 'cres', data: cresBase64}));
                            } else {
                            window.ReactNativeWebView.postMessage(JSON.stringify({type: 'error', message: 'CRes not found'}));
                            }
                        }
                        })();
                    `}
                    onMessage={(event) => {
                        const messageData = JSON.parse(event.nativeEvent.data);
                        if (messageData.type === "cres")
                            setCres(messageData.data);
                        else if (messageData.type === "error") setCres("Error");
                    }}
                    onNavigationStateChange={(event) => {
                        setCurrentLink(event.url);
                    }}
                />
            </Modal>
        );
    }
);

export default PaymentProcessor;
