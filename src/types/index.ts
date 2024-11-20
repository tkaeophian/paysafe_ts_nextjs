type PaysafeFieldEventDetails = {
  target?: {
    containerElement?: HTMLElement;
  };
};

type PaysafeFieldEventHandler = (
  eventInstance: PaysafeInstance,
  event: PaysafeFieldEventDetails
) => void;

type PaysafeFieldInstance = {
  isValid: () => boolean;
  isEmpty: () => boolean;
  on: (
    event: "FieldValueChange" | string,
    callback: PaysafeFieldEventHandler
  ) => void;
};

type PaysafeFields = {
  (fields: string): {
    valid: (callback: PaysafeFieldEventHandler) => void;
    invalid: (callback: PaysafeFieldEventHandler) => void;
  };
  cardNumber: PaysafeFieldInstance;
  expiryDate: PaysafeFieldInstance;
  cvv: PaysafeFieldInstance;
};

type PaysafeInstance = {
  fields: PaysafeFields;
  getCardBrand: () => string | undefined;
  tokenize: (
    data: Record<string, any>,
    callback: (
      instance: PaysafeInstance | null,
      error: PaysafeError | null,
      result: { token: string } | null
    ) => void
  ) => void;
};

type PaysafeFieldsSetupOptions = {
  environment: "TEST" | "LIVE";
  fields: {
    cardNumber: PaysafeFieldOptions;
    expiryDate: PaysafeFieldOptions;
    cvv: PaysafeFieldOptions;
  };
};

type PaysafeFieldOptions = {
  selector: string;
  placeholder?: string;
};

type PaysafeError = {
  code: string;
  detailedMessage: string;
};

type PaysafeTokenizeResult = {
  token: string; // Generated token
};

type PaysafeTokenizeOptions = {
  threeDS?: {
    amount: number; // The transaction amount
    currency: string; // The transaction currency (e.g., "USD")
    accountId: number; // Account ID for 3DS
    useThreeDSecureVersion2?: boolean; // Flag to enable 3DS Version 2
    authenticationPurpose?: "PAYMENT_TRANSACTION" | "RECURRING_TRANSACTION"; // Purpose of authentication
  };
  vault?: {
    holderName: string; // Name of the cardholder
  };
};

type Paysafe = {
  fields: {
    setup: (
      apiKey: string,
      options: PaysafeFieldsSetupOptions,
      callback: (
        instance: PaysafeInstance | null,
        error: PaysafeError | null
      ) => void
    ) => void;
  };
  getCardBrand: () => string | undefined;
  tokenize: (
    options: PaysafeTokenizeOptions,
    callback: (
      instance: PaysafeInstance | null,
      error: PaysafeError | null,
      result: PaysafeTokenizeResult | null
    ) => void
  ) => void;
};
