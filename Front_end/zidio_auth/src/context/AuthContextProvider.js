import { createContext, useState } from "react";

export const AuthContext=createContext();
const AuthProvider=({children})=>{
    const [user,setUser]=useState(()=>{
        const user=localStorage.getItem("user");
        return user?JSON.parse(user):{username:"",email:"",role:"user"};
    });
    return <AuthContext.Provider value={{user,setUser}}>{children}</AuthContext.Provider>

}
export default AuthProvider;
