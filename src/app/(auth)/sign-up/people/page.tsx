import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import dynamic from "next/dynamic";

const SignupFormPeople = dynamic(
  () => import("@/my_components/Form/SignupFormPeople")
);

function Page() {
  return (
    <Card className="w-[90%] max-w-[500px]">
      <CardHeader>
        <CardTitle>Signup Form</CardTitle>
        <CardDescription>
          Sign up here for people to see their info about the church
        </CardDescription>
      </CardHeader>
      <SignupFormPeople />
    </Card>
  );
}

export default Page;
