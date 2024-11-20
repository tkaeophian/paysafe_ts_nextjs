# Paysafe Payment

A TypeScript-based React component for integrating the Paysafe payment gateway with support for advanced, hosted field validation, event handling, tokenization, and error management.

## Features

- Customizable Fields: Supports cardNumber, cvv, and expiryDate.
- Complies with PCI SAQ-A, because Paysafe Group handles security for the sensitive fields.
- Event Listeners: Handles FieldValueChange, valid, and invalid events with visual feedback.
- Card Type Detection: Dynamically updates the card type (Visa, MasterCard, etc.) as the user enters the card number.
- Tokenization: Securely tokenizes payment data for server-side processing.
  ThreeDSecure: Supports 3D Secure authentication for enhanced transaction security.
- TypeScript Support: Fully typed interfaces and props for improved developer experience.
- No redirection is required.

## Prerequisite

Please refer to the official Paysafe documentation for information on integration and obtaining your API Key.

https://developer.paysafe.com/en/api-docs/paysafe-js/overview/

## Run Locally

1. Clone the repository:

```shell
git clone https://github.com/tkaeophian/paysafe_ts_nextjs.git
```

2. Install dependencies:

```shell
npm install
```

3. Start the development server:

```shell
npm run dev
```

## Contributing

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request with a detailed description of your changes.
