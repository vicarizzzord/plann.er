import { X, UserRound, Mail } from "lucide-react"
import { FormEvent } from "react";
import { Button } from "../../../components/Button";

interface ConfirmInviteModalProps {
    isOpen: boolean,
    onClose: () => void,
    createTrip: (event: FormEvent<HTMLFormElement>) => void;
    setOwnerName: (name: string) => void,
    setOwnerEmail: (email: string) => void
}

export const ConfirmTripCreationModal = ({ isOpen, onClose, createTrip, setOwnerEmail, setOwnerName }: ConfirmInviteModalProps) => {
    return (
        <>
            {isOpen &&
                (
                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
                        <div className="w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
                            <div className='space-y-2'>
                                <div className="flex items-center justify-between">
                                    <h2 className="font-lg font-semibold">Confirmar criação da viagem</h2>
                                    <button>
                                        <X onClick={onClose} className='size-5 text-zinc-400' />
                                    </button>
                                </div>
                                <p className="text-sm text-zinc-400">
                                    Para concluir a criação da viagem para <span className="font-semibold text-zinc-100">Florianópolis, Brasil</span> nas datas de <span className="font-semibold text-zinc-100">16 a 27 de Agosto de 2024</span> preencha seus dados abaixo:
                                </p>

                            </div>
                            <form onSubmit={createTrip} className='space-y-3'>
                                <div className='h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2'>
                                    <UserRound className='text-zinc-400 size-5' />
                                    <input onChange={event => setOwnerName((event.target as HTMLInputElement).value)} name='name' placeholder="Seu nome completo" className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1" />
                                </div>
                                <div className='h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2'>
                                    <Mail className='size-5 text-zinc-400' />
                                    <input onChange={event => setOwnerEmail((event.target as HTMLInputElement).value)} type="email" name='email' placeholder="Seu e-mail" className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1" />
                                </div>
                                <Button type='submit' size="full">
                                    Confirmar criação de viagem
                                </Button>
                            </form>
                        </div>
                    </div>
                )
            }
        </>
    )
}