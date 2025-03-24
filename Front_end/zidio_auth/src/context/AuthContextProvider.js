import { createContext, useState } from "react";

export const AuthContext=createContext();
const AuthProvider=({children})=>{
    const [user,setUser]=useState(null);
    return <AuthContext.Provider value={{user,setUser}}>{children}</AuthContext.Provider>

}
<<<<<<< HEAD
export default AuthProvider;

=======
export default AuthProvider;
>>>>>>> a5f0eba2180c3b0875467af3d49a6781a97e6d72
