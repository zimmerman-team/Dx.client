import React from "react";
import { useTitle } from "react-use";
import { Box, Container } from "@material-ui/core";
import Hero from "@app/modules/home-module/components/hero";
import HomeFooter from "@app/modules/home-module/components/Footer";

export default function TermsAndConditionsModule() {
  useTitle("Dataxplorer - Terms and Conditions");

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
        <Hero title="Terms & Conditions" />

        <Box
          height={{
            xs: 32,
            md: 40,
            lg: 80,
          }}
        />

        <Container maxWidth="lg">
          <b>Introduction</b>
          <br />
          These Terms and Conditions ("Terms") govern the use of the Dataxplorer
          platform ("Platform"), a software-as-a-service ("SaaS") data platform
          provided by Zimmerman BV ("Company"). By accessing or using the
          Platform, you ("Customer" or "you") agree to be bound by these Terms.
          <br />
          <b>Definitions</b>
          <br />
          <ul>
            <li>
              "Account" means the account created by Customer to access the
              Platform.
            </li>
            <li>
              "Content" means all data, information, and materials uploaded,
              posted, or stored on the Platform by Customer
            </li>
            <li>
              "Subscription" means the subscription plan chosen by Customer to
              access the Platform.
            </li>
            <li>
              "User" means an individual authorized by Customer to access the
              Platform.
            </li>
          </ul>
          <br />
          <b>Use of the Platform</b>
          <br />
          <ol>
            <li>
              <b>Eligibility:</b> The Platform is only available to individuals
              who are at least 18 years old and capable of forming a binding
              contract.
            </li>
            <li>
              <b>Account Creation:</b> To access the Platform, Customer must
              create an Account by providing accurate and complete information.
            </li>
            <li>
              <b>Subscription:</b> Customer must choose a Subscription plan to
              access the Platform. The Subscription plan will determine the
              features and limitations of the Platform available to Customer.
            </li>
            <li>
              <b>User Access:</b> Customer may authorize Users to access the
              Platform. Customer is responsible for ensuring that all Users
              comply with these Terms.
            </li>
          </ol>
          <br />
          <b>Content and Data</b>
          <br />
          <ol>
            <li>
              <b>Content Ownership:</b> Customer retains ownership of all
              Content uploaded, posted, or stored on the Platform.
            </li>
            <li>
              <b>Content Responsibility:</b> Customer is responsible for
              ensuring that all Content complies with applicable laws and
              regulations.
            </li>
            <li>
              <b>Data Processing:</b> The Company will process Content in
              accordance with its privacy policy and applicable data protection
              laws.
            </li>
          </ol>
          <br />
          <b>Payment and Subscription</b>
          <br />
          <ol>
            <li>
              <b>Fees:</b> Customer must pay all fees associated with the chosen
              Subscription plan.
            </li>
            <li>
              <b>Payment Terms:</b> Payment is due upon receipt of invoice. Late
              payments may incur additional fees.
            </li>
            <li>
              <b>Subscription Renewal:</b> The Subscription will automatically
              renew unless Customer cancels at least 30 days prior to the end of
              the current term.
            </li>
          </ol>
          <br />
          <b>Security and Support</b>
          <br />
          <ol>
            <li>
              <b>Security:</b> The Company will maintain reasonable security
              measures to protect the Platform and Customer Content.
            </li>
            <li>
              <b>Support:</b> The Company will provide reasonable support to
              Customer via email, phone, or online resources.
            </li>
          </ol>
          <br />
          <b>Intellectual Property</b>
          <br />
          <ol>
            <li>
              <b>Platform Ownership:</b> The Company retains ownership of all
              intellectual property rights in the Platform.
            </li>
            <li>
              <b>Content License:</b> Customer grants the Company a
              non-exclusive, royalty-free license to use, reproduce, and display
              Content for the purpose of providing the Platform.
            </li>
          </ol>
          <br />
          <b>Warranties and Disclaimers</b>
          <br />
          <ol>
            <li>
              <b>Warranty Disclaimer:</b> The Platform is provided "as-is" and
              "as-available" without warranties of any kind.
            </li>
            <li>
              <b>Limitation of Liability:</b> The Company's liability for
              damages is limited to the amount paid by Customer in the 12 months
              preceding the claim.
            </li>
          </ol>
          <br />
          <b>Termination</b>
          <br />
          <ol>
            <li>
              <b>Termination:</b> Either party may terminate the Subscription
              upon written notice to the other party.
            </li>
            <li>
              <b>Effect of Termination:</b> Upon termination, Customer will no
              longer have access to the Platform, and all Content will be
              deleted.
            </li>
          </ol>
          <br />
          <b>Governing Law</b>
          <br />
          <ol>
            <li>
              <b>Governing Law:</b> These Terms will be governed by and
              construed in accordance with the laws of [State/Country].
            </li>
            <li>
              <b>Dispute Resolution:</b> Any disputes arising out of or related
              to these Terms will be resolved through [Dispute Resolution
              Process].
            </li>
          </ol>
          <br />
          <b>Changes to Terms</b>
          <br />
          <ol>
            <li>
              <b>Changes:</b> The Company may modify these Terms at any time.
            </li>
            <li>
              <b>Notice:</b> The Company will provide notice of changes to these
              Terms by posting an updated version on the Platform.
            </li>
          </ol>
          <br />
          <b>Contact</b>
          <br />
          If you have any questions or concerns about these Terms, please
          contact us at{" "}
          <a href="mailto:privacy@zimmerman.team">privacy@zimmerman.team</a> at
          our HQ based in Amsterdam on Keizersgracht 520H, 1017 EK, Amsterdam,
          The Netherlands. By using the Platform, you acknowledge that you have
          read, understand, and agree to be bound by these Terms.
        </Container>
      </main>
      <HomeFooter />
    </div>
  );
}
