"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

const API_KEY =
  "T1QtMTE3MDQwOkItcWEyLTAtNTk1NjRlNWMtMC0zMDJjMDIxNDdmMDU4M2I2OGY4ZWQyNjkxNDIxMDczMzZiYWIyMTZmOWMzZGJiNTEwMjE0MTgwYzY1NGQ3OTgzZmI2NTliYzEzZWY4YWMyZmQ1MTliMjVhOTQxZQ==";
const paySafeOptions: PaysafeFieldsSetupOptions = {
  environment: "TEST",
  fields: {
    cardNumber: {
      selector: "#cardNumber",
      placeholder: "Card number",
    },
    expiryDate: {
      selector: "#cardExpiry",
      placeholder: "MM / YY",
    },
    cvv: {
      selector: "#cardCVC",
      placeholder: "CVV",
    },
  },
};

let isSetupInitialized = false;

const PaymentForm = () => {
  const [instance, setInstance] = useState<PaysafeInstance | null>(null);
  const [cardType, setCardType] = useState<string>("");
  const [isPayDisabled, setPayDisabled] = useState(true);
  const [isPaysafeLoaded, setPaysafeLoaded] = useState(false);

  useEffect(() => {
    const checkPaysafe = () => {
      if (window.paysafe) {
        setPaysafeLoaded(true);
      } else {
        // Retry after a short delay if not loaded
        setTimeout(checkPaysafe, 100);
      }
    };

    checkPaysafe(); // Start checking on mount
  }, []);

  useEffect(() => {
    if (!isPaysafeLoaded || typeof window === "undefined") return;

    const initializePaysafe = () => {
      if (!window.paysafe?.fields) {
        console.error("Paysafe is not available on the window object.");
        return;
      }

      if (!isSetupInitialized) {
        isSetupInitialized = true;
        window.paysafe.fields.setup(
          API_KEY,
          paySafeOptions,
          (paysafeInstance, error) => {
            if (error) {
              isSetupInitialized = false;
              console.error(
                `Setup error: ${error.code} ${error.detailedMessage}`
              );
            } else {
              setInstance(paysafeInstance); // Set the instance
              addEventListeners(paysafeInstance!); // Attach event listeners
            }
          }
        );
      }
    };

    initializePaysafe();
  }, [isPaysafeLoaded]);

  const addEventListeners = (instance: PaysafeInstance) => {
    instance.fields("cvv cardNumber expiryDate").valid((_, event) => {
      const target = event?.target?.containerElement;
      if (target) {
        target.classList.remove("border-rose-600");
        target.classList.add("border-green-600");
      }

      if (paymentFormReady(instance)) {
        setPayDisabled(false);
      }
    });

    instance.fields("cvv cardNumber expiryDate").invalid((_, event) => {
      const target = event?.target?.containerElement;
      if (target) {
        target.classList.remove("border-green-600");
        target.classList.add("border-rose-600");
      }

      if (!paymentFormReady(instance)) {
        setPayDisabled(true);
      }
    });

    instance.fields.cardNumber.on("FieldValueChange", () => {
      if (!instance.fields.cardNumber.isEmpty()) {
        const cardBrand = instance.getCardBrand()?.replace(/\s+/g, "");
        switch (cardBrand) {
          case "AmericanExpress":
            setCardType("amex");
            break;
          case "MasterCard":
            setCardType("mastercard");
            break;
          case "Visa":
            setCardType("visa");
            break;
          case "Diners":
            setCardType("diners-club");
            break;
          case "JCB":
            setCardType("jcb");
            break;
          case "Maestro":
            setCardType("maestro");
            break;
          case "Discover":
            setCardType("discover");
            break;
          default:
            setCardType("");
        }
      } else {
        setCardType("");
      }
    });
  };

  const paymentFormReady = (instance: PaysafeInstance) => {
    return (
      instance?.fields?.cardNumber?.isValid() &&
      instance?.fields?.expiryDate?.isValid() &&
      instance?.fields?.cvv?.isValid()
    );
  };

  const onPay = () => {
    if (!instance) {
      console.error("No PaySafe instance");
    }

    instance?.tokenize(
      {
        // Remove this comment to enable 3D secure
        // threeDS: {
        //   amount: 5,
        //   currency: "USD",
        //   accountId: 1001606520,
        //   useThreeDSecureVersion2: true,
        //   authenticationPurpose: "PAYMENT_TRANSACTION",
        // },
        vault: {
          holderName: "John Smith",
        },
      },
      handleTokenization
    );
  };

  const handleTokenization = (
    paysafeInstance: PaysafeInstance | null,
    error: PaysafeError | null,
    result: PaysafeTokenizeResult | null
  ): void => {
    // Helper function to handle alerts
    const showAlert = (message: string) => {
      alert(message);
    };

    // Handle error
    if (error) {
      const errorMessage = `Tokenization error: ${error.code} - ${error.detailedMessage}`;
      console.error(errorMessage);
      showAlert(errorMessage);
      return;
    }

    // Handle success
    if (result?.token) {
      const successMessage = `Token generated successfully: ${result.token}`;
      console.log(successMessage);
      showAlert(successMessage);
    } else {
      const unknownError = "Tokenization failed: Unknown error.";
      console.error(unknownError);
      showAlert(unknownError);
    }
  };

  if (!isPaysafeLoaded) {
    return <div>Loading payment system...</div>;
  }

  return (
    <>
      <div className="max-w-sm mx-auto">
        <div className="mb-5">
          <label
            htmlFor="cardNumber"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Card Number:
          </label>
          <div
            className="bg-gray-50 border h-12 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 relative"
            id="cardNumber"
          >
            {cardType ? (
              <div className="absolute right-2 top-2.5">
                <Image
                  src={`/${cardType}.png`}
                  className="rounded-md"
                  width={40}
                  height={40}
                  alt={cardType}
                />
              </div>
            ) : null}
          </div>
        </div>
        <div className="flex justify-between gap-4">
          <div className="mb-5">
            <label
              htmlFor="cardExpiry"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Expiry:
            </label>
            <div
              className="bg-gray-50 border h-12 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              id="cardExpiry"
            ></div>
          </div>
          <div className="mb-5">
            <label
              htmlFor="cardCVC"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              CVV:
            </label>
            <div
              className="bg-gray-50 border h-12 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              id="cardCVC"
            ></div>
          </div>
        </div>
        <button
          type="submit"
          disabled={isPayDisabled}
          onClick={() => onPay()}
          className="flex items-center justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center disabled:pointer-events-none disabled:opacity-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-4 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
            />
          </svg>
          <span>Pay</span>
        </button>

        <div className="mt-8">
          <p className="text-xs">Powered By</p>
          <div className="flex space-x-4 -mt-4">
            <Image
              src={"/paysafe-logo.svg"}
              width={140}
              height={40}
              alt="paysafe logo"
            />
            <Image src={"/visa.svg"} width={40} height={20} alt="visa logo" />
            <Image
              src={"/mastercard.svg"}
              width={40}
              height={20}
              alt="mastercard logo"
            />
            <Image
              src={"/maestro.svg"}
              width={80}
              height={20}
              alt="maestro logo"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentForm;
