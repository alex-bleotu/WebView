declare module "expo-payment-challenge" {
    import { ForwardRefRenderFunction } from "react";

    interface PaymentProcessorProps {
        onPaymentSuccess: () => void;
        onPaymentFailure: (error: Error) => void;
    }

    interface PaymentProcessorRef {
        initiatePayment: (paymentData: any) => Promise<void>;
    }

    const PaymentProcessor: ForwardRefRenderFunction<
        PaymentProcessorRef,
        PaymentProcessorProps
    >;

    export default PaymentProcessor;
    export { PaymentProcessorRef };
}
