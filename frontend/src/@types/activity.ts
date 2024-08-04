export interface Activities {
    date: string,
    activities: Activity[]
}

export interface Activity {
    id?: string,
    title: string,
    occurs_at: string
}