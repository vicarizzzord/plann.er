import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CreateTrip } from "./pages/CreateTrip";
import { TripDetails } from "./pages/TripDetails";
import { TripDetailsProvider } from "./contexts/TripDetailsContext";
import { ConfirmTripInvite } from "./pages/ConfirmTripInvite";




const router = createBrowserRouter([
    {
        path: '/',
        element: <CreateTrip />
    },
    {
        path: '/trips/:trip_id',
        element: <TripDetails />
    },
    {
        path: '/trips/:trip_id/participant/:participant_id/invite',
        element: <ConfirmTripInvite />
    }
])


export const App = () => {
    return (
        <TripDetailsProvider>
            <RouterProvider router={router} />
        </TripDetailsProvider>
    )
}