import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useSelector } from "react-redux";
import Loader from "../ui/loader";

const DeleteConfirmation = ({ isOpen, onClose, onDelete, title, description }) => {

    const { deleteInProgress: deleteAppointment } = useSelector(
    (state) => state.appointments
  )

  const { deleteInProgress: deleteParticipant } = useSelector(
    (state) => state.participants
  )

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) onClose();
            }}
        >
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-xl">{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <DialogFooter className="flex float-end">
                    <Button
                        variant="outline"
                        onClick={onDelete}
                        className="text-red-500 w-[110px] hover:text-red-700 hover:bg-red-50"
                    >
                        {/* <Trash className="h-4 w-4 mr-2" />
                        Delete */}
                        {deleteAppointment || deleteParticipant ? (
                            <Loader loaderColor={"border-sky-950"} />
                        ) : (
                            <>
                                <Trash className="h-4 w-4 mr-2" />
                                Delete
                            </>
                        )}
                    </Button>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteConfirmation;
