import { ArrowRight, UserRoundPlus } from "lucide-react"
import { Button } from "../../../../components/Button";
interface InviteGuestsStepProps {
    isOpen: boolean;
    emailsToInvite: string[];
    handleConfirmInviteModal: () => void
    handleGuestsModal: () => void
}

export const InviteGuestsStep = ({ emailsToInvite, handleConfirmInviteModal, isOpen, handleGuestsModal }: InviteGuestsStepProps) => {
    return (
        <>
            {isOpen && (
                <div className="h-16 bg-zinc-900 px-4 rounded-xl flex items-center shadow-shape gap-3">
                    <button type='button' onClick={handleGuestsModal} className='flex items-center gap-2 flex-1'>
                        <UserRoundPlus className='size-5 text-zinc-400' />
                        {emailsToInvite.length > 0 ? (<p>{emailsToInvite.length} pessoa(s) convidada(s)</p>) : (<p>Quem será convidado?</p>)}
                    </button>

                    <div className='w-px h-6 bg-zinc-700'></div>
                    <Button onClick={handleConfirmInviteModal}>
                        Confirmar viagem
                        <ArrowRight className='size-5' />
                    </Button>
                </div>
            )}
        </>
    )
}