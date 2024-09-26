import React from "react";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Row,
  Heading,
  Text,
  Button,
} from "@react-email/components";

interface Props {
  // peopleName: string;
  eventName: string;
  eventTime: string;
  eventDescription: string;
  eventDate: Date;
}

function NewEventEmail({
  // peopleName,
  eventName,
  eventTime,
  eventDate,
  eventDescription,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>{`You're invited to ${eventName}`}</Preview>
      <Body
        style={{
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f4f4f4",
          padding: "20px",
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <Heading style={{ textAlign: "center", color: "#333333" }}>
            You're Invited!
          </Heading>
          {/* <Text style={{ fontSize: "16px", color: "#555555" }}>
            Hello {peopleName},
          </Text> */}
          <Text style={{ fontSize: "16px", color: "#555555" }}>
            You are invited to the event <strong>{eventName}</strong> which will
            take place on <strong>{eventDate.toDateString()}</strong> at{" "}
            <strong>{eventTime}</strong>.
          </Text>
          <Text style={{ fontSize: "16px", color: "#555555" }}>
            {eventDescription}
          </Text>
          {/* <Row style={{ textAlign: "center", marginTop: "20px" }}>
            <Button
              href="#"
              style={{
                backgroundColor: "#007BFF",
                color: "#ffffff",
                padding: "10px 20px",
                textDecoration: "none",
                borderRadius: "4px",
              }}
            >
              RSVP Now
            </Button>
          </Row> */}
        </Container>
      </Body>
    </Html>
  );
}

export default NewEventEmail;
