import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import dynamic from "next/dynamic";

const SigninForm = dynamic(() => import("@/my_components/Form/SigninForm"));

function Page() {
  return (
    <Card className="w-[90%] max-w-[500px]">
      <CardHeader>
        <CardTitle>Signin Form</CardTitle>
        <CardDescription>Sign in here to go to the dashboard</CardDescription>
      </CardHeader>
      <SigninForm />
    </Card>
  );
}

export default Page;
