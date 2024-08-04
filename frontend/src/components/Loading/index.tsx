import { DotLoader } from "react-spinners"

interface LoadingProps {
    loading: boolean,
    color: string,
    size: number,

}

const override: React.CSSProperties = {
    display: "block",
    margin: "0 auto",
};



export const Loading = ({ loading, color, size }: LoadingProps) => {
    return (
        <DotLoader loading={loading} color={color} size={size} cssOverride={override} />
    )

}