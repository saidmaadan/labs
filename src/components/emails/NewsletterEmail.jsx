import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from '@react-email/components'
import * as React from 'react'

export const NewsletterEmail = ({
  previewText = '',
  title = '',
  content = '',
  unsubscribeUrl = '',
}) => (
  <Html>
    <Head />
    <Preview>{previewText}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={heading}>{title}</Heading>
        <Text style={text} dangerouslySetInnerHTML={{ __html: content }} />
        <Text style={footer}>
          If you'd like to unsubscribe, click{' '}
          <Link href={unsubscribeUrl} style={link}>
            here
          </Link>
          .
        </Text>
      </Container>
    </Body>
  </Html>
)

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '580px',
}

const heading = {
  fontSize: '32px',
  lineHeight: '1.3',
  fontWeight: '700',
  color: '#1a1a1a',
}

const text = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#333333',
  margin: '16px 0',
}

const footer = {
  fontSize: '14px',
  lineHeight: '1.5',
  color: '#666666',
  marginTop: '32px',
  textAlign: 'center',
}

const link = {
  color: '#2754C5',
  textDecoration: 'underline',
}

export default NewsletterEmail
