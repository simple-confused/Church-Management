import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { cookies, headers } from "next/headers";

async function PaymentsPage({ params }: { params: { peopleId: string } }) {
  let paymentInfo = null;
  const host = headers().get("host");
  const cookieStore = cookies();
  const access_token = cookieStore.get("access_token");
  const { data } = await axios.get(
    `http://${host}/api/v1/people/payments?peopleId=${params.peopleId}`,
    {
      headers: {
        Cookie: `${access_token?.name}=${access_token?.value}`,
      },
    }
  );
  if (data.success) {
    paymentInfo = data.data.Payments;
  }
  const formatTime = (date: string) => {
    const newDate = new Date(date);
    const hours = newDate.getHours();
    const minutes = newDate.getMinutes();
    return `${hours < 10 ? "0" + hours : hours}:${
      minutes < 10 ? "0" + minutes : minutes
    }`;
  };
  if (!paymentInfo) return null;
  return (
    <Table>
      <TableCaption>Payments</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paymentInfo.map((e: any) => (
          <TableRow key={e._id}>
            <TableCell>{new Date(e.createdAt || "").toDateString()}</TableCell>
            <TableCell>{formatTime(e.createdAt)}</TableCell>
            <TableCell>{e.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default PaymentsPage;
