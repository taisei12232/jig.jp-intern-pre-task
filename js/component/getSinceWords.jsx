import useSWR from "https://esm.sh/swr@1.3.0"
import React from "https://esm.sh/react@18.2.0";

export const fetchSinceWords = (watchword) => {
    const fetcher = async () => {
        const data = await fetch(`/watchword/${watchword}`);
        //console.log(await data.json())
        return await data.json();
    };
    return useSWR(`/doc/${watchword}`, fetcher,{ refreshInterval: 10 })
}