import { Calendar, Tag } from "lucide-react";
import { FormEvent } from "react";
import { useParams } from "react-router-dom";
import { DialogBase } from "../../../../components/Dialog";
import { useTrip } from "../../../../hooks/useContext/useTripDetails";
import { api } from "../../../../lib/axios";
import { Button } from "../../../../components/Button";


interface CreateActivityModalProps {
    isOpen: boolean;
    onClose: () => void;
}


export const CreateActivityModal = ({ onClose, isOpen }: CreateActivityModalProps) => {

    const { trip_id } = useParams()
    const { listActivities } = useTrip()

    const createActivity = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget)

        const title = data.get('title')?.toString()
        const occurs_at = data.get('occurs_at')?.toString()

        await api.post(`trips/${trip_id}/activities/create`, {
            title,
            occurs_at
        })
        console.log(title, occurs_at)

        if (trip_id)
            listActivities(trip_id)
        onClose()
    }
    return (
        <DialogBase isOpen={isOpen} title="Criar atividade" onClose={onClose} description="Todos os convidados podem visualizar a atividade">
            <form onSubmit={createActivity} className='space-y-3'>
                <div className='h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2'>
                    <Tag className='text-zinc-400 size-5' />
                    <input name='title' placeholder="Qual a atividade?" className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1" />
                </div>
                <div className="flex items-center gap-2">
                    <div className='h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2 flex-1'>
                        <Calendar className='size-5 text-zinc-400' />
                        <input type="datetime-local" name='occurs_at' placeholder="Data e hora da atividade" className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1" />
                    </div>
                </div>
                <Button type='submit' size="full">
                    Salvar atividade
                </Button>
            </form>
        </DialogBase>
    )
}