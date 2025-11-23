import { createContext, useContext, useState, type ReactNode } from "react";

interface AuthContextType {
    isAuthenticated: boolean,
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside an AuthProvider");
    }
    return context;
}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        return localStorage.getItem("auth_token") != null;
    });

    const login = (token: string) => {
        localStorage.setItem("auth_token", token);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("auth_token");
        setIsAuthenticated(false);
    };
    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}