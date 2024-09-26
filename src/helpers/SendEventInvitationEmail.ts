import NewEventEmail from "@/emails/NewEventEmail";
import { ApiResponse } from "@/types/ApiResponse";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface Props {
  churchName: string;
  eventName: string;
  eventTime: string;
  eventDescription: string;
  eventDate: Date;
  peopleInfo: {
    email: string;
    name: string;
  }[];
}

export async function SendEventInvitationEmail({
  churchName,
  eventDate,
  eventDescription,
  eventName,
  eventTime,
  peopleInfo,
}: Props): Promise<ApiResponse> {
  const peopleEmail = peopleInfo.map(({ email }) => email);
  try {
    const { data, error } = await resend.emails.send({
      from: `${churchName} <event@abhradippaul.blog>`,
      to: peopleEmail,
      subject: "Invitation Email",
      react: NewEventEmail({
        eventDate,
        eventDescription,
        eventName,
        eventTime,
      }),
    });
    if (data) {
      return {
        success: true,
        message: "Invitation email has sent successfully",
        data: data,
      };
    } else {
      console.log(error);
      return {
        success: false,
        message: "Failed to send verification email",
      };
    }
  } catch (err: any) {
    console.error(err);
    return {
      success: false,
      message: err.message,
    };
  }
}
