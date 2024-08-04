import { X } from "lucide-react";
import { DateRange, DayPicker } from "react-day-picker";

interface DatePickerProps {
    isOpen: boolean,
    onClose: () => void,
    startAndEndDates: DateRange | undefined;
    setStartAndEndDates: (dates: DateRange | undefined) => void;
}



export const DatePicker = ({ isOpen, onClose, setStartAndEndDates, startAndEndDates }: DatePickerProps) => {
    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
                    <div className="rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
                        <div className='space-y-2'>
                            <div className="flex items-center justify-between">
                                <h2 className="font-lg font-semibold">Selecione a data</h2>
                                <button>
                                    <X onClick={onClose} className='size-5 text-zinc-400' />
                                </button>
                            </div>
                            <DayPicker mode="range" selected={startAndEndDates} onSelect={setStartAndEndDates} />

                        </div>
                    </div>
                </div>
            )}
        </>
    )

}