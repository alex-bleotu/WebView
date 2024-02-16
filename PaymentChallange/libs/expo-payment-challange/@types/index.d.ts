declare module "expo-payment-challange" {
    export function WebView({
        uri,
        html,
    }: {
        uri?: string;
        html?: string;
    }): any;
}
