import WebView from "react-native-webview";

exports.WebView = function ({ uri, html }: { uri?: string; html?: string }) {
    if (uri !== undefined)
        return <WebView source={{ uri: uri }} style={{ flex: 1 }} />;
    else if (html !== undefined)
        return <WebView source={{ html: html }} style={{ flex: 1 }} />;
    else return null;
};
