import dynamic from "next/dynamic";

const TableComponent = dynamic(() => import("@/components/TableComponent"));
const PeopleNavbar = dynamic(() => import("../PeopleNavbar"));
const ChatSheetComponent = dynamic(
  () => import("@/components/ChatSheetComponent")
);

const tableHeading = ["Name", "Email", "Age", ""];

function Page() {
  return (
    <>
      <PeopleNavbar type="create" />
      <TableComponent type="people" tableHeading={tableHeading} />
      <ChatSheetComponent role="owner" />
    </>
  );
}

export default Page;
