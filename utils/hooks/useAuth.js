import { useRouter } from 'next/router'
import { useContext } from 'react'
import { firebaseClient } from '../firebaseClient'
import { AuthContext } from '../AuthContext'

export const useAuth = () => {
    // Extract useful user data from AuthContext.user
    const { email, displayName, photoURL, uid, xa } =
        useContext(AuthContext).user || {}
    let user =
        email || displayName || photoURL || uid || xa
            ? {
                  email,
                  displayName,
                  photoURL,
                  uid,
                  xa,
              }
            : null

    // Define logout function
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

    return { user, logout }
}
