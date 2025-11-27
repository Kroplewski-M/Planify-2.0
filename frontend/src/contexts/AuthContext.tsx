import { createContext, useContext, useState, type ReactNode } from "react";

interface AuthContextType {
    isAuthenticated: boolean,
    userId: number | undefined,
    login: (token: string, userId: number) => void;
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
    const [userId, setUserId] = useState<number | undefined>(() => {
        const stored = localStorage.getItem("user_id");
        return stored ? Number(stored) : undefined;
    });

    const login = (token: string, userId: number) => {
        localStorage.setItem("auth_token", token);
        localStorage.setItem("user_id", String(userId));

        setIsAuthenticated(true);
        setUserId(userId);
    };

    const logout = () => {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_id");

        setIsAuthenticated(false);
        setUserId(undefined);
    };
    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, userId }}>
            {children}
        </AuthContext.Provider>
    )
}