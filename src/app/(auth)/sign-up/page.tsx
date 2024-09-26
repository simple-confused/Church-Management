import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import dynamic from "next/dynamic";
const SignupForm = dynamic(() => import("@/my_components/Form/SignupForm"));

function Page() {
  return (
    <Card className="w-[90%] max-w-[500px]">
      <CardHeader>
        <CardTitle>Signup Form</CardTitle>
        <CardDescription>Create an account for church</CardDescription>
      </CardHeader>
      <SignupForm />
    </Card>
  );
}

export default Page;
