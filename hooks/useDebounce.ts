"use client"
import { useEffect, useState } from "react";

const useDebounce = (value : any, delay = 500) => {

    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler); // Cancel previous timeout 

    }, [value, delay]);

    return debouncedValue;
};

export default useDebounce; 