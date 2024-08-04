import { ArrowRight, Calendar, MapPin, Settings2 } from "lucide-react"
import { Button } from "../../../../components/Button";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns"
import { DatePicker } from "../../../../components/DatePicker";

interface DestinationAndDateStepProps {
    startAndEndDates: DateRange | undefined;
    handleGuestsInput: () => void;
    isGuestsInputOpen: boolean;
    setDestination: (destination: string) => void,
    setStartAndEndDate: (dates: DateRange | undefined) => void
}


export const DestinationAndDateStep = ({ handleGuestsInput, isGuestsInputOpen, setDestination, setStartAndEndDate, startAndEndDates }: DestinationAndDateStepProps) => {
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

    const handleDatePicker = () => {
        setIsDatePickerOpen(!isDatePickerOpen)
    }

    const displayDate = startAndEndDates && startAndEndDates.from && startAndEndDates.to ?
        format(startAndEndDates.from, "d ' de 'LLL").concat(' até ').concat(format(startAndEndDates.to, "d ' de 'LLL"))
        : null


    return (
        <div className="h-16 bg-zinc-900 px-4 rounded-xl flex items-center shadow-shape gap-3">
            <div className='flex items-center gap-2 flex-1'>
                <MapPin className='size-5 text-zinc-400' />
                <input onChange={event => setDestination((event.target as HTMLInputElement).value)} disabled={isGuestsInputOpen} type="text" placeholder="Para onde você vai?" className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1" />
            </div>

            <button onClick={handleDatePicker} disabled={isGuestsInputOpen} className='flex items-center gap-2 text-left w-[240px]'>
                <Calendar className='size-5 text-zinc-400' />
                <span className="text-lg text-zinc-400 w-40 flex-1" >
                    {displayDate || 'Quando?'}
                </span>
            </button>

            <DatePicker isOpen={isDatePickerOpen} onClose={handleDatePicker} setStartAndEndDates={setStartAndEndDate} startAndEndDates={startAndEndDates} />

            <div className='w-px h-6 bg-zinc-700'></div>

            {isGuestsInputOpen ? (
                <Button onClick={handleGuestsInput} variant="secondary">
                    Alterar local e data
                    <Settings2 className='size-5' />
                </Button>
            ) : (
                <Button onClick={handleGuestsInput}>
                    Continuar
                    <ArrowRight className='size-5' />
                </Button>)}

        </div>)


}