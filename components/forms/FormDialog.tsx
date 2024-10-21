import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { DropdownMenuItem } from "../ui/dropdown-menu";

export default function FormDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger>
        {/* <DropdownMenuItem className="w-full items-center justify-center"> */}
        <p className="w-full text-center cursor-pointer">Edit</p>
        {/* </DropdownMenuItem> */}
      </DialogTrigger>
      <DialogContent className="w-5/6 sm:w-3/4">{children}</DialogContent>
    </Dialog>
  );
}
