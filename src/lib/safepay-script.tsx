import Script from "next/script";

const SafePayScript = () => {
  return (
    <>
      <>
        <Script
          strategy="lazyOnload"
          src={`https://hosted.paysafe.com/js/v1/latest/paysafe.min.js`}
        />
      </>
    </>
  );
};

export default SafePayScript;
