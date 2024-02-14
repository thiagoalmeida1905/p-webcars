import { ReactNode, createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebaseConnection"

// ------------------------ Tipagens
interface AuthProviderProps{
    children: ReactNode
}

type AuthContextData = {
    signed: boolean;
    loadingAuth: boolean;
    handleInfoUser: ( {name, email, uid}: UserProps) => void;
    user: UserProps | null;
}

interface UserProps {
    uid: string;
    name: string | null;
    email: string | null;
}

// ------------------------ 
export const AuthContext = createContext({} as AuthContextData)


function AuthProvider( { children}: AuthProviderProps) {
    const [user, setUser] = useState<UserProps | null>(null);
    const [loadingAuth, setLoadingAuth] = useState(true);

    useEffect( () => {
        const unsub = onAuthStateChanged(auth, (user) => {//onAuth fica observando se há um usuario logado
            if(user) {
                //tem usuario
                setUser({
                    uid: user.uid,
                    name:user?.displayName,
                    email: user?.email
                })
                setLoadingAuth(false)
            }
            else {
                //não tem usuario
                setUser(null);
                setLoadingAuth(false)
            }
        })
        return () => {
            unsub();
        }
    }, [])

    function handleInfoUser( { name, email, uid}:UserProps) {
        setUser({
            name,
            email,
            uid
        })
    }

    return (
        <AuthContext.Provider 
            value={{ 
                signed: !!user,
                loadingAuth,
                handleInfoUser,
                user
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider