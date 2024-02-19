import axios from "axios";
import { forwardRef, useImperativeHandle, useState } from "react";
import { Modal } from "react-native";
import WebView from "react-native-webview";
import { html } from "../../html";

interface PaymentProcessorProps {
    onPaymentSuccess: () => void;
    onPaymentFailure: (error: Error) => void;
}

export interface PaymentProcessorRef {
    initiatePayment: (paymentData: any) => Promise<void>;
}

const PaymentProcessor = forwardRef<PaymentProcessorRef, PaymentProcessorProps>(
    ({ onPaymentSuccess, onPaymentFailure }, ref) => {
        const [showChallenge, setShowChallenge] = useState(false);
        const [challengeHTML, setChallengeHTML] = useState("");

        useImperativeHandle(ref, () => ({
            initiatePayment: async (paymentData: any) => {
                try {
                    axios
                        .post("https://api.example.com/pay", paymentData)
                        .then((response) => {
                            console.log(response.data);
                            if (response.data?.transStatus === "Y") {
                                setShowChallenge(false);
                                onPaymentSuccess();
                            } else if (response.data?.transStatus === "N") {
                                setShowChallenge(false);
                                onPaymentFailure(new Error("Payment failed"));
                            } else if (response.data?.transStatus === "C") {
                                setChallengeHTML(html);
                                setShowChallenge(true);
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                } catch (error: any) {
                    onPaymentFailure(error);
                }
            },
        }));

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
