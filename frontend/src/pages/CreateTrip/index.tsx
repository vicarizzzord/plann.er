import { FormEvent, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { useNavigate } from 'react-router-dom'
import { api } from '../../lib/axios'
import { ConfirmTripCreationModal } from './ConfirmTripCreationModal'
import { InviteGuestsModal } from '../../components/InviteGuestsModal'
import { DestinationAndDateStep } from './steps/DestinationAndDateStep'
import { InviteGuestsStep } from './steps/InviteGuestsStep'



export const CreateTrip = () => {
    const navigate = useNavigate()
    const [isGuestsInputOpen, setIsGuestsInputOpen] = useState<boolean>(false)
    const [isGuestModalOpen, setIsGuestsModalOpen] = useState<boolean>(false)
    const [isConfirmInviteModalOpen, setIsConfirmInviteModalOpen] = useState<boolean>(false)

    const [emailsToInvite, setEmailsToInvite] = useState([''])
    const [destination, setDestination] = useState('')
    const [ownerName, setOwnerName] = useState('')
    const [ownerEmail, setOwnerEmail] = useState('')
    const [startAndEndDates, setStartAndEndDates] = useState<DateRange | undefined>()

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

    const handleGuestsInput = (): void => {
        setIsGuestsInputOpen(!isGuestsInputOpen)
    }

    const handleGuestsModal = (): void => {
        setIsGuestsModalOpen(!isGuestModalOpen)
    }

    const handleConfirmInviteModal = (): void => {
        setIsConfirmInviteModalOpen(!isConfirmInviteModalOpen)
    }

    const createTrip = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();


        if (!destination) {
            return
        }

        if (!startAndEndDates?.from || !startAndEndDates.to) {
            return
        }

        if (!ownerEmail || !ownerName) {
            return
        }

        const response = await api.post('/trips', {
            destination,
            starts_at: startAndEndDates?.from,
            ends_at: startAndEndDates?.to,
            emails_to_invite: emailsToInvite,
            owner_name: ownerName,
            owner_email: ownerEmail
        })

        const { tripId } = response.data;

        navigate(`/trips/${tripId}`)
    }

    return (
        <div className="h-screen flex items-center justify-center bg-pattern bg-no-repeat bg-center">

            <div className="max-w-3xl w-full px-6 text-center space-y-10">
                <div className='flex flex-col items-center gap-3'>
                    <img src="/logo.svg" alt="plann.er logo" />
                    <p className="text-zinc-300 text-lg">Convide seus amigos e planeje sua próxima viagem!</p>
                </div>

                <div className='space-y-4'>
                    <DestinationAndDateStep startAndEndDates={startAndEndDates} setStartAndEndDate={setStartAndEndDates} setDestination={setDestination} handleGuestsInput={handleGuestsInput} isGuestsInputOpen={isGuestsInputOpen} />
                    <InviteGuestsStep emailsToInvite={emailsToInvite} handleConfirmInviteModal={handleConfirmInviteModal} handleGuestsModal={handleGuestsModal} isOpen={isGuestsInputOpen} />
                </div>

                <p className="text-zinc-500 text-sm">Ao planejar sua viagem pela plann.er você automaticamente concorda <br />
                    com nossos <a className="text-zinc-300 underline" href="">termos de uso</a> e <a className="text-zinc-300 underline" href="">políticas de privacidade.</a></p>
            </div>

            <InviteGuestsModal create isOpen={isGuestModalOpen} onClose={handleGuestsModal} handleAddEmail={handleAddEmail} handleDeleteEmail={handleDeleteEmail} emailsToInvite={emailsToInvite} />
            <ConfirmTripCreationModal setOwnerEmail={setOwnerEmail} setOwnerName={setOwnerName} isOpen={isConfirmInviteModalOpen} onClose={handleConfirmInviteModal} createTrip={createTrip} />
        </div>

    )
}

