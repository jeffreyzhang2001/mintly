export const mapUserData = (user) => {
    const { email, displayName, photoURL, uid, xa } = user
    return {
        email,
        name: displayName,
        photoURL,
        id: uid,
        token: xa,
    }
}
