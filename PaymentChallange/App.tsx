import { WebView } from "expo-payment-challange";
import { StyleSheet } from "react-native";

export default function App() {
    return <WebView uri="google.com" />;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
