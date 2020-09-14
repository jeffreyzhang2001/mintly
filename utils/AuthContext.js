import { useState, useEffect, createContext } from 'react'
import nookies from 'nookies'
import { firebaseClient } from './firebaseClient'
import PropTypes from 'prop-types'

export const AuthContext = createContext({
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
