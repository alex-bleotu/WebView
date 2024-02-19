import PaymentProcessor, { PaymentProcessorRef } from "expo-payment-challenge";
import { useRef, useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";

export default function App() {
    const [name, setName] = useState("Thomas Jefferson");
    const [cardNumber, setCardNumber] = useState("4111111111111111");
    const [expiryMonth, setExpiryMonth] = useState("12");
    const [expiryYear, setExpiryYear] = useState("30");
    const [cvc, setCvc] = useState("200");
    const [amount, setAmount] = useState("1167");

    const paymentProcessorRef = useRef<PaymentProcessorRef>(null);

    return (
        <View style={styles.container}>
            <TextInput
                onChangeText={setName}
                value={name}
                style={styles.input}
                placeholder="Name on card"
            />
            <TextInput
                onChangeText={setCardNumber}
                value={cardNumber}
                style={styles.input}
                placeholder="Card number"
            />
            <View style={styles.expiry}>
                <TextInput
                    onChangeText={setExpiryMonth}
                    value={expiryMonth}
                    style={[styles.input, { width: 95, marginRight: 10 }]}
                    placeholder="MM"
                />
                <TextInput
                    onChangeText={setExpiryYear}
                    value={expiryYear}
                    style={[styles.input, { width: 95 }]}
                    placeholder="YY"
                />
            </View>
            <TextInput
                onChangeText={setCvc}
                value={cvc}
                style={styles.input}
                placeholder="CVC"
            />
            <TextInput
                onChangeText={setAmount}
                value={amount}
                style={styles.input}
                placeholder="Amount"
            />
            <View style={styles.button}>
                <Button
                    title="Pay"
                    onPress={() => {
                        paymentProcessorRef.current?.initiatePayment(
                            expiryMonth,
                            expiryYear,
                            cardNumber,
                            name,
                            amount
                        );
                    }}
                />
            </View>

            <PaymentProcessor
                // @ts-ignore
                ref={paymentProcessorRef}
                onPaymentSuccess={() => console.log("Payment success")}
                onPaymentFailure={(error: Error) =>
                    console.log("Payment failure")
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    expiry: {
        flexDirection: "row",
    },
    input: {
        borderWidth: 1,
        borderColor: "black",
        marginBottom: 10,
        width: 200,
        borderRadius: 20,
        paddingHorizontal: 15,
    },
    button: {
        width: 200,
        marginTop: 10,
        backgroundColor: "black",
        borderRadius: 20,
        overflow: "hidden",
    },
});
