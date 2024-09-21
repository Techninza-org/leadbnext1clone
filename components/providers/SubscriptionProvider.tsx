"use client";

import { createContext, useContext, useState } from "react";
import { userQueries } from "@/lib/graphql/user/queries";
import { useQuery } from "graphql-hooks";

type SubscriptionContextType = {
    plans: any[];
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {

    const [plans, setPlans] = useState<any[]>([])

    const { data: plansData, loading: plansLoading } = useQuery(userQueries.GET_PLANS, {
        skip: plans.length > 0,
        skipCache: true,
        onSuccess: ({ data }) => {
            setPlans(data.getPlans)
        }
    });


    return (
        <SubscriptionContext.Provider value={{ plans }}>
            {children}
        </SubscriptionContext.Provider>
    );
};

export const useSubscription = () => {
    const context = useContext(SubscriptionContext);
    if (context === undefined) {
        throw new Error('useSubscription must be used within a SubscriptionProvider');
    }
    return context;
};
