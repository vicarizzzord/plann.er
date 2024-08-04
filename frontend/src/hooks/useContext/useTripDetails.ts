import { useContext } from "react";
import { TripDetailsContext } from "../../contexts/TripDetailsContext";



export const useTrip = () => useContext(TripDetailsContext)