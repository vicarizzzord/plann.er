import { X } from "lucide-react"
import { ReactNode } from "react"


interface DialogBaseProps {
    title: string,
    description?: string,
    isOpen: boolean,
    onClose?: () => void,
    children: ReactNode

}


export const DialogBase = ({ description, title, children, onClose, isOpen }: DialogBaseProps) => {
    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
                    <div className="w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
                        <div className='space-y-2'>
                            <div className="flex items-center justify-between">
                                <h2 className="font-lg font-semibold">{title}</h2>
                                <button>
                                    <X onClick={onClose} className='size-5 text-zinc-400 hover:text-zinc-600' />
                                </button>
                            </div>
                            <p className="text-sm text-zinc-400">
                                {description}
                            </p>
                        </div>
                        {children}
                    </div>
                </div>)
            }
        </>

    )
}