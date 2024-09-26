import VerificationEmail from "@/emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function SendVerificationEmail(
  email: string,
  name: string,
  verificationCode: string
): Promise<ApiResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: "Abhradip <verification@abhradippaul.blog>",
      to: [email],
      subject: "Verification Email",
      react: VerificationEmail({ name, verificationCode }),
    });
    if (data) {
      return {
        success: true,
        message: "Verification email sent successfully",
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
