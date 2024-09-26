import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import dynamic from "next/dynamic";

const CheckInForm = dynamic(() => import("@/my_components/Form/CheckInForm"));

function CheckInPage() {
  return (
    <Card className="w-[90%] max-w-[500px]">
      <CardHeader>
        <CardTitle>Check In Form</CardTitle>
        <CardDescription>Check in user</CardDescription>
      </CardHeader>
      <CardContent>
        <CheckInForm />
      </CardContent>
    </Card>
  );
}

export default CheckInPage;
