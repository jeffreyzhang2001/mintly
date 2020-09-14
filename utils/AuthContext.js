import { useRouter } from 'next/router'
import { useState, useEffect, useContext, createContext } from 'react'
import PropTypes from 'prop-types'
import nookies from 'nookies'
import { firebaseClient } from './firebaseClient'

const AuthContext = createContext({
    user: null,
})

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)

    useEffect(() => {
        return firebaseClient.auth().onIdTokenChanged(async (user) => {
            if (!user) {
                setUser(null)
                nookies.set(undefined, 'token', '')
                return
            }

            const token = await user.getIdToken()
            setUser(user)
            nookies.set(undefined, 'token', token)
        })
    }, [])

    return (
        <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
    )
}

AuthProvider.propTypes = {
    children: PropTypes.node,
}

export const useAuth = () => {
    const router = useRouter()

    const logout = async () => {
        return firebaseClient
            .auth()
            .signOut()
            .then(() => {
                router.push('/login')
            })
            .catch((e) => {
                console.error(e)
            })
    }

    return { user: useContext(AuthContext).user, logout }
}
