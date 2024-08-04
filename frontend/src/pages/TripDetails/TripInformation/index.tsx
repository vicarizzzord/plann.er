import { format } from "date-fns"
import { Calendar, MapPin, Settings2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Button } from "../../../components/Button"
import { useTrip } from "../../../hooks/useContext/useTripDetails"
import { BeatLoader } from "react-spinners"
import { UpdateTripModal } from "./UpdateTripModal"



export const TripInformation = () => {
    const { trip_id } = useParams()
    const { getTrip, trip, tripIsLoading } = useTrip()
    const [updateTripModaIslOpen, setUpdateTripModalIsOpen] = useState<boolean>(false)


    const handleUpdateTripModal = () => {
        setUpdateTripModalIsOpen(!updateTripModaIslOpen)
    }

    useEffect(() => {
        if (trip_id)
            getTrip(trip_id)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const displayDate = trip ?
        format(trip.starts_at, "d ' de 'LLL").concat(' até ').concat(format(trip.ends_at, "d ' de 'LLL"))
        : null

    return (
        <div className="px-4 h-16 bg-zinc-900 shadow-shape rounded-xl flex items-center justify-between">
            {!tripIsLoading ? (
                <>
                    <div className="flex items-center gap-2">
                        <MapPin className="size-5 text-zinc-400" />
                        <span className=" text-zinc-100">
                            {trip?.destination}
                        </span>
                    </div>
                    <div className="flex items-center gap-5">
                        <div className="flex items-center gap-2">
                            <Calendar className="size-5 text-zinc-400" />
                            <span className=" text-zinc-100">
                                {displayDate}
                            </span>
                        </div>
                        <div className='w-px h-6 bg-zinc-700'></div>
                        <Button onClick={handleUpdateTripModal} variant="secondary">
                            Alterar local e data
                            <Settings2 className='size-5' />
                        </Button>
                    </div>
                </>) : (
                <div className="flex items-center justify-center w-full gap-3">
                    <p>Carregando informações da viagem</p>
                    <BeatLoader color="#3f3f46" size={10} />
                </div>
            )}
            <UpdateTripModal isOpen={updateTripModaIslOpen} onClose={handleUpdateTripModal} />
        </div>
    )
}