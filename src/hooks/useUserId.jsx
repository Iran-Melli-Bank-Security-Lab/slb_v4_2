
import {useSession} from "../SessionContext"

export function useUserId(){

    const user = useSession().session
    return user.user.id
}
