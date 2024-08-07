import { CircleCheck, CircleXIcon, Plus } from "lucide-react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useTrip } from "../../../hooks/useContext/useTripDetails";
import { Loading } from "../../../components/Loading";
import { Button } from "../../../components/Button";
import { api } from "../../../lib/axios";

interface ActivitiesListProps {
    handleCreateActivityModal: () => void
}


export const ActivitiesList = ({ handleCreateActivityModal }: ActivitiesListProps) => {

    const { trip_id } = useParams()
    const { activities, listActivities, activitiesIsLoading } = useTrip();
    const [hoveredActivity, setHoveredActivity] = useState<string | null>(null);

    const handleMouseEnter = (activityId: string | undefined) => {
        if (activityId) {
            setHoveredActivity(activityId)
        }
    }

    const handleMouseLeave = () => {
        setHoveredActivity(null)
    }

    const deleteActivity = async (activityId: string) => {
        await api.delete(
            `/trips/${trip_id}/activities/${activityId}`
        )
        if (trip_id)
            listActivities(trip_id)
    }


    return (
        <div className="space-y-8 min-h-80">
            {!activitiesIsLoading ? (
                <>
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-semibold">Atividades</h2>
                        <Button onClick={handleCreateActivityModal}>
                            <Plus className='size-5' />
                            Cadastrar atividade
                        </Button>
                    </div>
                    {activities?.map((schedule) => {
                        return (
                            <div key={schedule.date} className="space-y-2.5">
                                <div className="flex gap-2 items-baseline">
                                    <span className="text-xl font-semibold text-zinc-300">Dia {format(schedule.date, 'd')}</span>
                                    <span className="text-xs text-zinc-500">{format(schedule.date, 'EEEE', { locale: ptBR })}</span>
                                </div>
                                {schedule.activities.length > 0 ? (
                                    <div>
                                        {schedule.activities.map((activity) => {
                                            return (
                                                <div key={activity.id} className="space-y-2.5">
                                                    <div className="px-4 py-2.5 bg-zinc-900 rounded-xl shadow-shape flex items-center gap-3">
                                                        <div onMouseEnter={() => handleMouseEnter(activity.id)} onMouseLeave={handleMouseLeave}>
                                                            {hoveredActivity === activity.id ? <CircleXIcon onClick={() => deleteActivity(hoveredActivity)} className="size-6 text-red-400 cursor-pointer" /> : <CircleCheck className="size-6 text-lime-300" />}
                                                        </div>
                                                        <span className="text-zinc-100 text-lg6">{activity.title}</span>
                                                        <span className="text-zinc-400 text-sm ml-auto">{format(activity.occurs_at, 'HH:mm')} h</span>

                                                    </div>
                                                </div>)
                                        })}
                                    </div>
                                ) : (
                                    <div className="space-y-2.5">
                                        <p className="text-zinc-500 text-sm">Nenhuma atividade cadastrada nessa data.</p>
                                    </div >)
                                }
                            </div >
                        )
                    })}
                </>
            ) : (<Loading loading={activitiesIsLoading} color="#bef264" size={60} />)}
        </div >
    )
}