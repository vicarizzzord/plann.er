export interface Guest {
    id?: string,
    name: string | null,
    email: string,
    is_confirmed: boolean,
    trip_id?: string
}