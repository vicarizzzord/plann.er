import { CheckCircle2, CircleDashed, UserMinus2Icon, UserPlusIcon } from "lucide-react"
import { Button } from "../../../components/Button"
import { FormEvent, useEffect, useState } from "react"
import { useTrip } from "../../../hooks/useContext/useTripDetails"
import { useParams } from "react-router-dom"
import { Loading } from "../../../components/Loading"
import { InviteGuestsModal } from "../../../components/InviteGuestsModal"
import { Guest } from "../../../@types/guest"
import { api } from "../../../lib/axios"
import { ConfirmParticipantRemotionPopUp } from "./ConfirmParticipantRemotionPopUp"


export const Guests = () => {

    const { trip_id } = useParams()
    const { guests, listGuests, guestsIsLoading } = useTrip();
    const [isGuestModalOpen, setIsGuestModalOpen] = useState<boolean>(false)
    const [isDeleteConfirmationPopUpOpen, setIsDeleteConfirmationPopUpOpen] = useState<boolean>(false)
    const [emailsToInvite, setEmailsToInvite] = useState<string[]>([])
    const [guestToRemove, setGuestToRemove] = useState<Guest | null>()


    const handleGuestModal = () => {
        setIsGuestModalOpen(!isGuestModalOpen)
    }

    const handleDeleteConfirmationPopup = () => {
        setIsDeleteConfirmationPopUpOpen(!isDeleteConfirmationPopUpOpen)
    }


    const handleAddEmail = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        const email = data.get('email')?.toString();

        if (!email) {
            return
        }
        if (emailsToInvite.includes(email)) {
            return
        }

        setEmailsToInvite([...emailsToInvite, email])

        event.currentTarget.reset()
    }

    const handleDeleteEmail = (emailToRemove: string) => {
        const newEmailList = emailsToInvite.filter(email => email !== emailToRemove)
        setEmailsToInvite(newEmailList)
    }

    const handleSelectGuestToRemove = (guest: Guest) => {
        setGuestToRemove(guest)
        handleDeleteConfirmationPopup()
    }

    const handleSubmitInvites = async () => {
        if (!emailsToInvite)
            return
        await api.post(
            `/trips/${trip_id}/invite`,
            { emailsToInvite }
        )
        if (trip_id)
            listGuests(trip_id)
        handleGuestModal()
    }




    useEffect(() => {
        if (trip_id)
            listGuests(trip_id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="space-y-6">
            <h2 className="font-semibold text-xl">Convidados</h2>
            <div className="space-y-5 min-h-30">
                {!guestsIsLoading ? (
                    <>
                        {
                            guests.length === 0 ? (<p className="text-zinc-500 text-sm">Nenhum convidado adicionado</p>) : (
                                <>
                                    {guests?.map((guest, index) => {

                                        return (
                                            <div key={guest.id} className="flex items-start justify-between">
                                                <div className="space-y-1.5">
                                                    <span className="block font-medium text-zinc-100">
                                                        {guest.name ?? `Convidado ${index}`}
                                                    </span>
                                                    <span className="block text-xs text-zinc-400">
                                                        {guest.email}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    {guest.is_confirmed ? (<CheckCircle2 className="text-green-400 size-5" />) : (<CircleDashed className="text-zinc-400 size-5" />)}
                                                    <div className='w-px h-4 bg-zinc-700'></div>
                                                    <UserMinus2Icon className="size-5 text-zinc-500 hover:text-red-400 cursor-pointer" onClick={() => handleSelectGuestToRemove(guest)} />
                                                </div>
                                            </div>
                                        )
                                    })}

                                </>
                            )
                        }
                    </>
                ) : (
                    <Loading loading={guestsIsLoading} color="#bef264" size={40} />
                )}
            </div>
            <Button variant="secondary" size="full" onClick={handleGuestModal}>
                <UserPlusIcon className='size-5' />
                Adicionar convidados
            </Button>
            <ConfirmParticipantRemotionPopUp guest={guestToRemove} isOpen={isDeleteConfirmationPopUpOpen} onClose={handleDeleteConfirmationPopup} />
            <InviteGuestsModal create={false} isOpen={isGuestModalOpen} onClose={handleGuestModal} emailsToInvite={emailsToInvite} handleAddEmail={handleAddEmail} handleDeleteEmail={handleDeleteEmail} handleSubmitInvites={handleSubmitInvites} />

        </div>
    )
}