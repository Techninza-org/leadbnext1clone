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

  const [authToken, setToken] = useAtom(userAuthToken)
  const setUser = useSetAtom(userAtom)
  const router = useRouter()

  useEffect(() => {
    const userT = getCookie('x-lead-token');
    const userC = getCookie('x-lead-user');
    if (userT && userC) {
      const userData = JSON?.parse(userC);
      const userToken = JSON.parse(userT);

      setUser(userData);
      setToken(userToken || authToken);
      
      client.setHeader('Authorization', `x-lead-token ${userToken || authToken}`)
    } else {
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
    setCookie('x-lead-user', user, { expires: expiresDate });
    setCookie('x-lead-token', JSON.stringify(user.token), { expires: expiresDate });

    // Redirection fix for role based eventualy
    const role = user?.role?.name?.toLowerCase()?.split(" ").join("");

    router.refresh();

    router.push([ROOT].includes(role) ? '/dashboard' : '/leads' )
  };
  const logout = () => {
    setUser(null)
    setToken(null)
    deleteCookie('x-lead-user')
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