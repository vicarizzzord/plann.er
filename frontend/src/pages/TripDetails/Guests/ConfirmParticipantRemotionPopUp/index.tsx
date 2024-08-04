import { UserMinus2 } from "lucide-react"
import { useParams } from "react-router-dom";
import { Guest } from "../../../../@types/guest";
import { DialogBase } from "../../../../components/Dialog";
import { useTrip } from "../../../../hooks/useContext/useTripDetails";
import { api } from "../../../../lib/axios";
import { Button } from "../../../../components/Button";

interface ConfirmParticipantRemotionPopUpProps {
    guest: Guest | undefined | null,
    isOpen: boolean,
    onClose: () => void;

}


export const ConfirmParticipantRemotionPopUp = ({ isOpen, guest, onClose }: ConfirmParticipantRemotionPopUpProps) => {
    const { trip_id } = useParams()
    const { listGuests } = useTrip();

    const deleteParticipant = async (participantId: string | undefined) => {
        if (!participantId)
            return
        console.log(guest)
        await api.delete(
            `participants/${participantId}`
        )
        if (trip_id)
            listGuests(trip_id)
        onClose()
    }


    return (
        <>
            {guest?.id && (
                <DialogBase isOpen={isOpen} title="Remover participante" onClose={onClose}>
                    <p>Confirmar a remoção do participante {guest.name || guest.email}?</p>
                    <Button variant="caution" size="full" onClick={() => deleteParticipant(guest.id)}>
                        <UserMinus2 className='size-5' />
                        Remover convidado
                    </Button>
                </DialogBase>)}
        </>

    )
}