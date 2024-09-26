import DialogComponent from "@/components/DialogComponent";
import { Button } from "@/components/ui/button";
import InsertUserToTagForm from "@/my_components/Form/InsertUserToTagForm";

function InsertNewUserToTagDialog() {
  return (
    <DialogComponent
      dialogTrigger={
        <Button size="lg" className="text-xl">
          Add user
        </Button>
      }
      dialogTitle="Insert user"
      dialogDescription="Insert one or multiple user in the tag"
      dialogContent={<InsertUserToTagForm />}
    />
  );
}

export default InsertNewUserToTagDialog;
