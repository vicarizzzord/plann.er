import { useNavigate, useParams } from "react-router-dom"
import { useTrip } from "../../hooks/useContext/useTripDetails";
import { FormEvent, useEffect, useState } from "react";
import { DialogBase } from "../../components/Dialog";
import { User2Icon } from "lucide-react";
import { Button } from "../../components/Button";
import { format } from "date-fns";
import { api } from "../../lib/axios";


export const ConfirmTripInvite = () => {
    const { participant_id, trip_id } = useParams();
    const navigate = useNavigate()
    const { trip, getTrip, getGuest } = useTrip();
    const [name, setName] = useState<string>()

    useEffect(() => {
        if (participant_id) {
            getGuest(participant_id)

        }
        if (trip_id) {
            getTrip(trip_id)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const updateGuest = async (event: FormEvent) => {
        event.preventDefault();
        await api.put(
            `/participants/${participant_id}`,
            { name }
        )

        navigate(`/trips/${trip_id}`, { replace: true })

    }

    const displayDate = trip ?
        format(trip.starts_at, "d ' de 'LLL").concat(' até ').concat(format(trip.ends_at, "d ' de 'LLL"))
        : null

    const description = `Para confirmar sua viagem para ${trip?.destination} em ${displayDate}, insira seus dados abaixo:`
    return (
        <DialogBase isOpen={true} title="Confirmar convite de viagem" description={description}>
            <div className='h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2'>
                <User2Icon className='text-zinc-400 size-5' />
                <input name='guestName' onChange={event => setName((event.target as HTMLInputElement).value)} placeholder="Seu nome" className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1" />
            </div>
            <Button type='submit' size="full" onClick={updateGuest}>
                Confirmar presença
            </Button>
        </DialogBase>
    )
}