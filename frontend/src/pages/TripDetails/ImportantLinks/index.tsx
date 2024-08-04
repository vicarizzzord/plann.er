import { CircleXIcon, Link2, Plus } from "lucide-react";
import { Button } from "../../../components/Button";
import { useParams } from "react-router-dom";
import { useTrip } from "../../../hooks/useContext/useTripDetails";
import { useEffect, useState } from "react";
import { Loading } from "../../../components/Loading";
import { AddLinkModal } from "./AddLinkModal";
import { api } from "../../../lib/axios";


export const ImportantLinks = () => {
    const { trip_id } = useParams();
    const { links, listLinks, linksIsLoading } = useTrip();
    const [isAddLinkModalOpen, setIsAddLinkModalOpen] = useState(false);
    const [hoveredLink, setHoveredLink] = useState<string | null>()

    const handleAddLinkModal = () => {
        setIsAddLinkModalOpen(!isAddLinkModalOpen)
    }

    const handleMouseEnter = (linkId: string | undefined) => {
        if (linkId) {
            setHoveredLink(linkId)
        }
    }

    const handleMouseLeave = () => {
        setHoveredLink(null)
    }

    const deleteLink = async (linkId: string | undefined) => {
        await api.delete(
            `/trips/${trip_id}/links/${linkId}`
        )
        if (trip_id)
            listLinks(trip_id)

    }

    useEffect(() => {
        if (trip_id)
            listLinks(trip_id)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trip_id])

    return (
        <div className="space-y-6">
            <h2 className="font-semibold text-xl">Links importantes</h2>
            <div className="space-y-5 min-h-30">
                {!linksIsLoading ? (<>
                    {
                        links.length === 0 ? (<p className="text-zinc-500 text-sm">Nenhum link adicionado</p>) : (
                            <div>
                                {links.map((link) => {
                                    return (
                                        <div key={link.id} className="flex items-center justify-between my-3">
                                            <div className="flex space-y-1.5">
                                                <div>
                                                    <span className="block font-medium text-zinc-100">
                                                        {link.title}
                                                    </span>
                                                    <span className="block text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer truncate">
                                                        <a href={link.url} target="_blank" >
                                                            {link.url}
                                                        </a>
                                                    </span>
                                                </div>
                                                <div onMouseEnter={() => handleMouseEnter(link.id)} onMouseLeave={handleMouseLeave}>
                                                    {hoveredLink === link.id ? (<CircleXIcon className=" text-red-400 cursor-pointer size-5 shrink-0" onClick={() => deleteLink(hoveredLink)} />) : (<Link2 className="text-zinc-400 size-5 shrink-0 bg-transparent" />)}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    }
                </>) : (<Loading loading={linksIsLoading} color="#bef264" size={40} />)}

            </div>
            <Button onClick={handleAddLinkModal} variant="secondary" size="full">
                <Plus className='size-5' />
                Cadastrar novo link
            </Button>
            <AddLinkModal isOpen={isAddLinkModalOpen} onClose={handleAddLinkModal} />
        </div>
    )
}