export const getJWTSecret = () => {
    const token = process.env.JWT_SECRET
    if(!token){
        throw new Error("Trebuie sa implementati variabla de environment, \"JWT_SECRET\" in fisierul .env")
    }
    return token
}  
