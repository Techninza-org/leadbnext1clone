"use client"

import { createContext, useContext, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { APIError } from 'graphql-hooks';
import { useAtom, useSetAtom } from 'jotai';
import { z } from 'zod';
import { deleteCookie, getCookie, setCookie } from "cookies-next"

import { useToast } from '@/components/ui/use-toast';

import { useGraphql } from './GraphqlProvider';

import { loggedUserSchema } from '@/types/auth';
import { userAtom, userAuthToken } from '@/lib/atom/userAtom';
import { MANAGER, ROOT } from '@/lib/role-constant';

interface AuthContextType {
  handleUserLogin: ({ user, error }: { user: z.infer<typeof loggedUserSchema>, error?: APIError<object> | undefined }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast()
  const client = useGraphql()

  const [authToken,setToken] = useAtom(userAuthToken)
  const setUser = useSetAtom(userAtom)
  const router = useRouter()

  useEffect(() => {
    const userC = getCookie('x-lead-token');
    if (userC) {
      const userData = JSON.parse(userC);
      setUser(userData);
      setToken(userData.token);
      client.setHeader('Authorization', `x-lead-token ${userData.token || authToken}`)
    } else {
      router.push('/login')
      setUser(null);
      setToken("");
    }
  }, [authToken, client, router, setToken, setUser]);

  const handleUserLogin = ({ user, error }: { user: z.infer<typeof loggedUserSchema>, error?: APIError<object> | undefined }) => {

    if (error) {
      const message = error?.graphQLErrors?.map((e: any) => e.message).join(", ")
      toast({
        title: 'Error',
        description: message || "Something went wrong",
        variant: "destructive"
      })
      return;
    }

    setUser(user)
    setToken(user.token)
    client.setHeader('Authorization', `x-lead-token ${user.token}`)

    const expiresDate = new Date();
    expiresDate.setDate(expiresDate.getDate() + 1);
    setCookie('x-lead-token', user, { expires: expiresDate });

    // Redirection fix for role based eventualy
    const role = user.role.name.toLowerCase()

    router.push([MANAGER, ROOT].includes(role) ? '/dashboard' : `/${role}/leads`)
  };
  const logout = () => {
    setUser(null)
    setToken(null)
    deleteCookie('x-lead-token')
    client.cache?.clear()
    router.push('/login')
  };

  return (
    <AuthContext.Provider value={{ handleUserLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};