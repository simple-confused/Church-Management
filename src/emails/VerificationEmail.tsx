import React from "react";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Row,
  Column,
  Heading,
  Text,
  Link,
  Button,
} from "@react-email/components";

interface WelcomeEmailProps {
  name: string;
  verificationCode: string;
}

function VerificationEmail({ name, verificationCode }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Our Service</Preview>
      <Body className="bg-gray-100 p-6">
        <Container className="bg-white rounded-lg p-6 mx-auto shadow-md max-w-xl">
          <Heading className="text-2xl font-bold text-gray-900 mb-6">
            Welcome, {name}!
          </Heading>
          <Text className="text-gray-700 text-lg mb-4">
            Thank you for joining our service. We're excited to have you on
            board.
          </Text>
          <Text className="text-gray-700 text-lg mb-4">
            Your verification code is:
          </Text>
          <Row>
            <Column>
              <Button className="bg-blue-500 text-white text-lg font-bold py-2 px-4 rounded">
                {verificationCode}
              </Button>
            </Column>
          </Row>
          <Text className="text-gray-700 text-lg mb-4">
            Please enter this code to verify your email address.
          </Text>
          <Text className="text-gray-700 text-lg mb-4">
            If you have any questions, feel free to{" "}
            <Link
              href="mailto:support@example.com"
              className="text-blue-500 underline"
            >
              contact our support team
            </Link>
            .
          </Text>
          <Text className="text-gray-700 text-lg">
            Best regards,
            <br />
            The Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default VerificationEmail;
