import { useState, useEffect } from "react";

// Function to get the value from localStorage or return the initial value
const getLocalValue = (key, initValue) => {
    console.log("getLocalValue called"); // Log when this function is called

    // SSR Next.js
    if (typeof window === 'undefined') {
        console.log("Window is undefined - returning initial value"); // Log if SSR
        return initValue;
    }

    // Attempt to retrieve the value from localStorage
    const localValue = localStorage.getItem(key);
    console.log(`localStorage value for key "${key}":`, localValue); // Log localStorage value
    
    if (localValue) {
        try {
            const parsedValue = JSON.parse(localValue);
            console.log("Parsed localStorage value:", parsedValue); // Log parsed value
            if (parsedValue !== null) return parsedValue; // Handle case where `localStorage` has `null`
        } catch (error) {
            console.error('Error parsing localStorage value:', error); // Log parsing errors
        }
    }

    // Return result of a function or fallback to initValue
    if (initValue instanceof Function) {
        console.log("Initial value is a function - calling it"); // Log if initial value is a function
        return initValue();
    }

    console.log("Returning initial value:", initValue); // Log the fallback initial value
    return initValue;
};

const useLocalStorage = (key, initValue) => {
    console.log("useLocalStorage called"); // Log when the hook is called

    const [value, setValue] = useState(() => {
        console.log("Initializing state with getLocalValue()"); // Log when useState is called
        return getLocalValue(key, initValue);
    });

    useEffect(() => {
        console.log("useEffect triggered - updating localStorage"); // Log when useEffect is triggered
        try {
            // Set value in localStorage whenever the state changes
            localStorage.setItem(key, JSON.stringify(value));
            console.log(`Updated localStorage for key "${key}" with value:`, value); // Log the updated localStorage value
        } catch (error) {
            console.error('Error setting localStorage value:', error); // Log storage errors
        }
    }, [key, value]);

    return [value, setValue];
};

export default useLocalStorage;
