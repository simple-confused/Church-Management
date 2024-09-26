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

async function AttendancePage({ params }: { params: { peopleId: string } }) {
  let attendanceInfo = null;
  const host = headers().get("host");
  const cookieStore = cookies();
  const access_token = cookieStore.get("access_token");
  const { data } = await axios.get(
    `http://${host}/api/v1/people/attendance?peopleId=${params.peopleId}`,
    {
      headers: {
        Cookie: `${access_token?.name}=${access_token?.value}`,
      },
    }
  );
  if (data.success) {
    attendanceInfo = data.data.Attendance;
  }
  const formatTime = (date: string) => {
    const newDate = new Date(date);
    const hours = newDate.getHours();
    const minutes = newDate.getMinutes();
    return `${hours < 10 ? "0" + hours : hours}:${
      minutes < 10 ? "0" + minutes : minutes
    }`;
  };
  if (!attendanceInfo) return null;
  return (
    <Table>
      <TableCaption>Attendance</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Event</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {attendanceInfo.map((e: any) => (
          <TableRow key={e._id}>
            <TableCell>{new Date(e.createdAt || "").toDateString()}</TableCell>
            <TableCell>{formatTime(e.createdAt)}</TableCell>
            {e?.Event_Info?.name && <TableCell>{e.Event_Info.name}</TableCell>}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default AttendancePage;
