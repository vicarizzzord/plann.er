import { createContext, ReactNode, useState } from "react";
import { Activities } from "../../@types/activity";
import { Guest } from "../../@types/guest";
import { Link } from "../../@types/link";
import { api } from "../../lib/axios";
import { Trip } from "../../@types/trip";



export interface TripDetailsContextType {
    isAllLoading: () => boolean,
    trip: Trip | undefined,
    getTrip: (tripId: string) => void,
    tripIsLoading: boolean,
    guest: Guest | undefined,
    getGuest: (guestId: string) => void,
    guestIsLoading: boolean,
    guests: Guest[],
    listGuests: (tripId: string) => void,
    guestsIsLoading: boolean,
    links: Link[],
    listLinks: (tripId: string) => void,
    linksIsLoading: boolean,
    activities: Activities[],
    listActivities: (tripId: string) => void,
    activitiesIsLoading: boolean
}

export const TripDetailsContext = createContext({} as TripDetailsContextType)

export const TripDetailsProvider = ({ children }: { children: ReactNode }) => {
    const [guests, setGuests] = useState<Guest[]>([])
    const [guestsIsLoading, setGuestsIsLoading] = useState(false)
    const [guest, setGuest] = useState<Guest>()
    const [guestIsLoading, setGuestIsLoading] = useState(false)
    const [trip, setTrip] = useState<Trip>()
    const [tripIsLoading, setTripIsLoading] = useState(false)
    const [links, setLinks] = useState<Link[]>([])
    const [linksIsLoading, setLinksIsLoading] = useState(false)
    const [activities, setActivities] = useState<Activities[]>([])
    const [activitiesIsLoading, setActivitiesIsLoading] = useState(false)

    const getTrip = async (tripId: string) => {
        setTripIsLoading(true)
        const { data } = await api.get(
            `/trips/${tripId}`
        )
        setTrip(data.trip)
        setTripIsLoading(false)
    }

    const isAllLoading = () => {
        return guestIsLoading && guestsIsLoading && activitiesIsLoading && linksIsLoading && tripIsLoading
    }

    const listGuests = async (tripId: string) => {
        setGuestsIsLoading(true)
        const { data } = await api.get(
            `/trips/${tripId}/participants`
        )
        setGuests(data.participants);
        setGuestsIsLoading(false);
    }

    const getGuest = async (guestId: string) => {
        setGuestIsLoading(true)
        const { data } = await api.get(
            `/participants/${guestId}`
        )
        setGuest(data.participant)
        setGuestIsLoading(false)
    }
    const listLinks = async (tripId: string) => {
        setLinksIsLoading(true)
        const { data } = await api.get(
            `/trips/${tripId}/links`
        )
        setLinks(data.links);
        setLinksIsLoading(false);
    }
    const listActivities = async (tripId: string) => {
        setActivitiesIsLoading(true)
        const { data } = await api.get(
            `/trips/${tripId}/activities`
        )
        setActivities(data.activities);
        setActivitiesIsLoading(false);
    }

    return (
        <TripDetailsContext.Provider
            value={{
                isAllLoading,
                trip,
                getTrip,
                tripIsLoading,
                guest,
                getGuest,
                guestIsLoading,
                guests,
                listGuests,
                guestsIsLoading,
                links,
                linksIsLoading,
                listLinks,
                activities,
                listActivities,
                activitiesIsLoading
            }}
        >
            {children}
        </TripDetailsContext.Provider>
    )
}