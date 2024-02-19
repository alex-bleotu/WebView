export const createBody = (
    json: any,
    cardExpiryMonth: string,
    cardExpiryYear: string,
    cardNumber: string,
    cardHolderName: string,
    purchaseAmount: string
) => {
    // Create a new object with additional fields
    const newFields = {
        messageType: "AReq",
        messageVersion: "2.1.0",
        messageCategory: "01",
        deviceChannel: "02",
        threeDSCompInd: "U",
        threeDSRequestorAuthenticationInd: "01",
        threeDSServerTransID: "ce908afc-e929-4894-b20d-d347d19a5df1",
        notificationURL:
            "https://eu1.threedsecurempi.com/EMVTDS/jsp/CardHolder/BacktoMerchantWebsite.jsp",
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
        version: "2.2.0.1.0",
        istestcard: true, // TODO: change to false
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
