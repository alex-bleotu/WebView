// Import the native module. On web, it will be resolved to ExpoPaymentChallange.web.ts
// and on native platforms to ExpoPaymentChallange.ts
import ExpoPaymentChallangeModule from "./ExpoPaymentChallangeModule";

export const hello = () => {
    return ExpoPaymentChallangeModule.hello();
};
