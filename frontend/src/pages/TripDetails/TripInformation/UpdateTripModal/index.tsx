import { format } from "date-fns"
import { Calendar, PlaneTakeoff } from "lucide-react"
import { FormEvent, useState } from "react"
import { DateRange } from "react-day-picker"
import { useParams } from "react-router-dom"
import { DatePicker } from "../../../../components/DatePicker"
import { DialogBase } from "../../../../components/Dialog"
import { api } from "../../../../lib/axios"
import { Button } from "../../../../components/Button"

interface UpdateTripModalProps {
    isOpen: boolean,
    onClose: () => void
}





export const UpdateTripModal = ({ isOpen, onClose }: UpdateTripModalProps) => {
    const { trip_id } = useParams()
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
    const [startAndEndDates, setStartAndEndDates] = useState<DateRange | undefined>()
    const [destination, setDestination] = useState('')

    const handleDatePicker = () => {
        setIsDatePickerOpen(!isDatePickerOpen)
    }

    const displayDate = startAndEndDates && startAndEndDates.from && startAndEndDates.to ?
        format(startAndEndDates.from, "d ' de 'LLL").concat(' até ').concat(format(startAndEndDates.to, "d ' de 'LLL"))
        : null
    const updateTrip = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();



        await api.put(`/trips/${trip_id}`, {
            destination: destination,
            starts_at: startAndEndDates?.from,
            ends_at: startAndEndDates?.to,
        })
        onClose();
    }
    return (
        <DialogBase isOpen={isOpen} onClose={onClose} title="Alterar local e data" description="Insira o novo destino e data da viagem abaixo:">
            <form onSubmit={updateTrip} className='space-y-3'>
                <div className='h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2'>
                    <PlaneTakeoff className='text-zinc-400 size-5' />
                    <input name='destination' onChange={event => setDestination((event.target as HTMLInputElement).value)} placeholder="Qual o novo destino?" className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1" />
                    <button onClick={handleDatePicker} className='flex items-center gap-2 text-left w-[240px]'>
                        <Calendar onClick={handleDatePicker} className='size-5 text-zinc-400' />
                        <span className="text-lg text-zinc-400 w-40 flex-1" >
                            {displayDate || 'Quando?'}
                        </span>
                    </button>
                </div>
                <Button type='submit' size="full">
                    Atualizar viagem
                </Button>
            </form>
            <DatePicker isOpen={isDatePickerOpen} onClose={handleDatePicker} startAndEndDates={startAndEndDates} setStartAndEndDates={setStartAndEndDates} />
        </DialogBase>
    )
}