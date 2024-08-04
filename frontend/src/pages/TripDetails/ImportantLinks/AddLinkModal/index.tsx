import { LinkIcon, CaseSensitive } from "lucide-react"
import { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { DialogBase } from "../../../../components/Dialog";
import { api } from "../../../../lib/axios";
import { Button } from "../../../../components/Button";

interface AddLinkModalProps {
    isOpen: boolean,
    onClose: () => void
}

export const AddLinkModal = ({ isOpen, onClose }: AddLinkModalProps) => {
    const { trip_id } = useParams();
    const navigate = useNavigate()


    const addLink = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        const title = data.get('title')?.toString()
        const url = data.get('url')?.toString()


        await api.post(
            `/trips/${trip_id}/link/create`, {
            title: title,
            url: url
        })
        onClose()
        navigate(`/trips/${trip_id}`)

    }
    return (
        <DialogBase isOpen={isOpen} onClose={onClose} title="Adicionar novo link">
            <form onSubmit={addLink} className="space-y-3">
                <div className='h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2'>
                    <CaseSensitive className='text-zinc-400 size-5' />
                    <input name='title' placeholder="Título" className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1" />
                </div>
                <div className="flex items-center gap-2">
                    <div className='h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2 flex-1'>
                        <LinkIcon className='text-zinc-400 size-5' />
                        <input name='url' placeholder="Url" className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1" />
                    </div>
                </div>
                <Button type='submit' size="full">
                    Adicionar link
                </Button>
            </form>

        </DialogBase>
    )
}
