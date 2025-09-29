import React from "react";
import { useTitle } from "react-use";
import { Box, Container } from "@material-ui/core";
import Hero from "app/modules/home-module/components/hero";
import HomeFooter from "app/modules/home-module/components/Footer";

export default function PrivacyPolicyModule() {
  useTitle("Dataxplorer - Privacy Policy");

  return (
    <div
      css={`
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-top: 50px;
        min-height: calc(100vh - 50px);
        @media (max-width: 880px) {
          margin-top: 66px;
          min-height: calc(100vh - 66px);
        }
      `}
    >
      <main
        css={`
          padding-bottom: 100px;
          @media (max-width: 960px) {
            padding-bottom: 40px;
          }
          background-color: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0) 0%,
            #f2f7fd 100%
          );
        `}
      >
        <Hero title="Privacy Policy" />

        <Box
          height={{
            xs: 32,
            md: 40,
            lg: 80,
          }}
        />

        <Container maxWidth="lg">
          <ol>
            <li>
              <b>Introduction</b>
              <br />
              Welcome to the Dataxplorer platform! We are committed to
              protecting your personal information and your right to privacy. If
              you have any questions or concerns about our policy, or our
              practices with regards to your personal information, please
              contact us at privacy@zimmerman.team.
            </li>
            <br />
            <li>
              <b>Information We Collect</b>
              <br />
              We collect personal information that you voluntarily provide to us
              when registering at the Dataxplorer platform, expressing an
              interest in obtaining information about us or our products and
              services, when purchasing a product or service, or otherwise
              contacting us. The personal information that we collect depends on
              the context of your interactions with us and the Dataxplorer
              platform, the choices you make and the products and features you
              use. The personal information we collect can include the
              following:
              <br />
              <b>Name and Contact Data.</b> We collect your first and last name,
              email address, and other similar contact data.
              <br />
              <b>Credentials.</b> We do not collect passwords or password hints.
              Security information used for authentication and account access is
              managed by Auth0 1 a trusted third party that handles
              authentication and authorisation in between your business account
              and the Dataxplorer platform.
              <br />
              <b>Payment Data.</b> We collect data necessary to process your
              payment if you make purchases, such as your payment instrument
              number (such as a credit card number), and the security code
              associated with your payment instrument. All payment data is
              stored by our payment processor and you should review its privacy
              policies and contact the payment processor directly to respond to
              your questions. All payment processing is handled by{" "}
              <a
                target="_blank"
                href="https://stripe.com"
                rel="noopener noreferrer"
              >
                Stripe
              </a>
              , a trusted third party that handles payments in between your
              payment gateway (credit card, bank etc.) and the Dataxplorer
              platform.
              <br />
              <b>
                All Personal Information that you provide to us must be true,
                complete and accurate, and you must notify us of any changes to
                such personal or business information.
              </b>
              <br />
            </li>
            <br />
            <li>
              <b>How We Use Your Information</b>
              <br />
              We use personal information collected via our Site for a variety
              of business purposes described below. We process your personal
              information for these purposes in reliance on our legitimate
              business interests, in order to enter into or perform a contract
              with you, with your consent, and/or for compliance with our legal
              obligations. We indicate the specific processing grounds we rely
              on next to each purpose listed below.
              <br />
              We use the information we collect or receive:
              <br />
              <b>To send you marketing and promotional communications.</b> We
              and/or our third-party marketing partners may use the personal
              information you send to us for marketing purposes, if this is in
              accordance with your marketing preferences. You can opt-out of our
              marketing emails at any time (see the "What are your privacy
              rights" below).
              <br />
              <b>To send administrative information to you.</b> We may use your
              personal information to send you product, service and new feature
              information and/or information about changes to our terms,
              conditions, and policies.
              <br />
              <b>To fulfill and manage your orders.</b> We may use your
              information to fulfill and manage your orders, payments, returns,
              and exchanges made through the Dataxplorer platform.
              <br />
              <b>To protect our Dataxplorer platform.</b> We may use your
              information as part of our efforts to keep our Dataxplorer
              platform safe and secure (for example, for fraud monitoring and
              prevention).
              <br />
              <b>To enforce our terms, conditions and policies.</b>
              <br />
              <b>To respond to legal requests and prevent harm.</b> If we
              receive a subpoena or other legal request, we may need to inspect
              the data we hold to determine how to respond.
            </li>
            <br />
            <li>
              <b>Will Your Information Be Shared With Anyone?</b>
              <br />
              We may process or share data based on the following legal basis:
              <br />
              <b>Consent:</b> We may process your data if you have given us
              specific consent to use your personal information in a specific
              purpose.
              <br />
              <b>Legitimate Interests:</b> We may process your data when it is
              reasonably necessary to achieve our legitimate business interests.
              <br />
              <b>Performance of a Contract:</b> Where we have entered into a
              contract with you, we may process your personal information to
              fulfill the terms of our contract.
              <br />
              <b>Legal Obligations:</b> We may disclose your information where
              we are legally required to do so in order to comply with
              applicable law, governmental requests, a judicial proceeding,
              court order, or legal process, such as in response to a court
              order or a subpoena (including in response to public authorities
              to meet national security or law enforcement requirements).
              <br />
              <b>Other legal requirements:</b> We may process your information
              in order to protect your vital interests or those of a third party
              (e.g., to prevent harm).
            </li>
            <br />
            <li>
              <b>Do We Use Cookies and Other Tracking Technologies?</b>
              <br />
              We may use cookies and other tracking technologies (like web
              beacons and pixels) to access or store information. Specific
              information about how we use such technologies and how you can
              refuse certain cookies is set out in our Cookie Policy
            </li>
            <br />
            <li>
              <b>How Long Do We Keep Your Information?</b>
              <br />
              We will only keep your personal information for as long as it is
              necessary for the purposes set out in this privacy policy, unless
              a longer retention period is required or permitted by law (such as
              tax, accounting or other legal requirements). When we have no
              ongoing legitimate business need to process your personal
              information, we will either delete or anonymize your personal
              information.
            </li>
          </ol>
        </Container>
      </main>
      <HomeFooter />
    </div>
  );
}
