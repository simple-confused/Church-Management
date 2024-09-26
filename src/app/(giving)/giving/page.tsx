import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import dynamic from "next/dynamic";

const GivingForm = dynamic(() => import("@/my_components/Form/GivingForm"));

function Page() {
  return (
    <Card className="w-[90%] max-w-[500px]">
      <CardHeader>
        <CardTitle>Giving Form</CardTitle>
        <CardDescription>
          Submit giving form for cash transaction
        </CardDescription>
      </CardHeader>
      <CardContent>
        <GivingForm />
      </CardContent>
    </Card>
  );
}

export default Page;
