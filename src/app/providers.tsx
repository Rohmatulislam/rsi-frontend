"use client";

import { 
    QueryClient, 
    QueryClientProvider, 
    isServer 
} from "@tanstack/react-query";
import { toast } from "sonner";
import { queryConfig } from "~/lib/react-query";


function makeQueryClient(){
    return new QueryClient({
        defaultOptions: {
            ...queryConfig,
            mutations: {
                onError: () => {
                    toast.error("Sebuah kesalahan terjadi", {
                        description: "Kontak Tim support jika masalah terus menerus",
                    })
                },
            },
        },
    });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient(){
    if (isServer) {
        //server: always make a new query client
        return makeQueryClient();
    }else{
        if (!browserQueryClient){
            browserQueryClient = makeQueryClient();
        }
        return browserQueryClient;
    }
}

export default function TanstackQueryProvider({children}: {children: React.ReactNode}){
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}