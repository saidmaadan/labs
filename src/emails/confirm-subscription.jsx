import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components"
import * as React from "react"

export const ConfirmSubscriptionEmail = ({
  confirmationUrl,
  firstName,
}) => (
  <Html>
    <Head />
    <Preview>Confirm your newsletter subscription</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Confirm your subscription</Heading>
        <Text style={text}>
          Hi {firstName ? firstName : "there"},
        </Text>
        <Text style={text}>
          Thank you for subscribing to our newsletter! Please confirm your subscription by clicking the button below:
        </Text>
        <Section style={buttonContainer}>
          <Button
            pX={20}
            pY={12}
            style={button}
            href={confirmationUrl}
          >
            Confirm Subscription
          </Button>
        </Section>
        <Text style={text}>
          If you did not request this subscription, you can safely ignore this email.
        </Text>
        <Text style={footer}>
          Best regards,
          <br />
          The InventiveLabs Team
        </Text>
      </Container>
    </Body>
  </Html>
)

export default ConfirmSubscriptionEmail

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "560px",
}

const h1 = {
  fontSize: "24px",
  fontWeight: "bold",
  marginBottom: "24px",
  color: "#1a1a1a",
}

const text = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#333333",
  marginBottom: "24px",
}

const buttonContainer = {
  marginBottom: "24px",
}

const button = {
  backgroundColor: "#000000",
  borderRadius: "4px",
  color: "#ffffff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center",
  display: "inline-block",
}

const footer = {
  color: "#898989",
  fontSize: "14px",
  marginTop: "32px",
  marginBottom: "0",
}
