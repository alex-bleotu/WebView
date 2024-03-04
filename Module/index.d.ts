declare module "expo-payment-challenge" {
    import { ForwardRefRenderFunction } from "react";

    interface PaymentChallengeProps {
        /*
         * Callback to be called when payment is successful
         */
        onPaymentSuccess: () => void;

        /*
         * Callback to be called when payment fails
         */
        onPaymentFailure: (error: Object) => void;

        /*
         * Callback to be called when payment is cancelled
         */
        onPaymentCancel?: () => void;

        /*
         * Callback to be called when RReq is received
         */
        onRReqReceived?: (rReq: Object) => void;

        /*
         * Callback to be called when an error occurs
         */
        onError?: (error: Error) => void;

        /*
         * Background color of the payment authentification
         */
        backgroundColor?: string;

        /*
         * Header text of the payment authentification
         */
        header?: string;

        /*
         * Merchant identifier
         */
        merchantIdentifier: string;

        /*
         * Notification URL
         */
        notificationURL?: string;
    }

    interface PaymentChallengeRef {
        initiatePayment: (
            /*
             * Expiry month of the card
             *
             * @example "01"
             */
            cardExpiryMonth: string,

            /*
             * Expiry year of the card
             *
             * @example "23"
             */

            cardExpiryYear: string,

            /*
             * Card number
             *
             * @example "4111111111111111"
             */
            cardNumber: string,

            /*
             * Name of the card holder
             *
             * @example "John Doe"
             */
            cardHolderName: string,

            /*
             * Amount to be paid
             *
             * @example "10.00"
             */
            purchaseAmount: string
        ) => Promise<void>;
    }

    const PaymentChallenge: ForwardRefRenderFunction<
        PaymentChallengeRef,
        PaymentChallengeProps
    >;

    export default PaymentChallenge;
    export { PaymentChallengeRef };
}
