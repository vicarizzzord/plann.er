import { useState } from "react";
import { ImportantLinks } from "./ImportantLinks";
import { Guests } from "./Guests";
import { TripInformation } from "./TripInformation";
import { ActivitiesList } from "./ActivitiesList";
import { CreateActivityModal } from "./ActivitiesList/CreateActivityModal";

export const TripDetails = () => {
    const [isCreateActivityModalOpen, setIsCreateActivityModalOpen] = useState(false);

    const handleCreateActivityModal = () => {
        setIsCreateActivityModalOpen(!isCreateActivityModalOpen)
    }

    return (
        <div className="max-w-6xl px-6 py-10 mx-auto space-y-8">
            <div className="bg-pattern bg-no-repeat bg-center">
                <img src="/logo.svg" alt="plann.er logo" />

            </div>
            <TripInformation />
            <main className="flex gap-16 px-6">
                <div className="flex-1 space-y-6">
                    <ActivitiesList handleCreateActivityModal={handleCreateActivityModal} />
                </div>
                <div className="w-80 space-y-6">
                    <ImportantLinks />
                    <div className='w-full h-px bg-zinc-700' />
                    <Guests />
                </div>
            </main>
            <CreateActivityModal isOpen={isCreateActivityModalOpen} onClose={handleCreateActivityModal} />
        </div>
    )
}