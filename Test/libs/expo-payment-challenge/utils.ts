export const notificationDefaultURL =
    "https://eu1.threedsecurempi.com/EMVTDS/jsp/CardHolder/BacktoMerchantWebsite.jsp";

export const createBody = (
    json: any,
    cardExpiryMonth: string,
    cardExpiryYear: string,
    cardNumber: string,
    cardHolderName: string,
    purchaseAmount: string,
    notificationURL?: string
) => {
    const newFields = {
        messageType: "AReq",
        messageVersion: "2.1.0",
        messageCategory: "01",
        deviceChannel: "02",
        threeDSCompInd: "U",
        threeDSRequestorAuthenticationInd: "01",
        notificationURL: notificationURL || notificationDefaultURL,
        cardExpiryDate: cardExpiryYear + cardExpiryMonth,
        acctNumber: cardNumber,
        cardHolderName: cardHolderName,
        purchaseAmount: purchaseAmount,
        purchaseCurrency: "840",
        transType: "01",
    };

    const mergedJson = { ...json, ...newFields };

    return mergedJson;
};

export const createRequestBody = (message: any, merchantIdentifier: string) => {
    const messageString = JSON.stringify(message);

    const api = {
        version: "2.1.0",
        istestcard: true, // TODO: change this to false in production
        isPIT: false,
        compressed: false,
        merchantidentifier: merchantIdentifier,
    };

    const requestBody = {
        api: api,
        messagetype: message.messageType,
        message: messageString,
    };

    return requestBody;
};
