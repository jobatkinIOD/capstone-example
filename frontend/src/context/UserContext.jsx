import React, { useState, useContext } from "react";
import { useCookies } from 'react-cookie' // first do 'npm install react-cookie', see https://www.npmjs.com/package/react-cookie

// 1. Create the context
const UserContext = React.createContext();

// Custom provider component for this context.
// Use it in App.jsx like <UserProvider>...</UserProvider>
export const UserProvider = (props) => {

    // more examples at https://clerk.com/blog/setting-and-using-cookies-in-react
    const [cookies, setCookie, removeCookie] = useCookies(['user']); // get cookies and helper functions. empty array is dependencies
    console.log(cookies);

    // const localStorageUser = JSON.parse(localStorage.getItem('user')); // alternative to cookies using localStorage

    // store the current user in state at the top level
    const [currentUser, setCurrentUser] = useState(cookies.user ? cookies.user : {}); // default user object, read from cookies if possible
    
    // const [currentUser, setCurrentUser] = useState(localStorageUser ? localStorageUser : {}); // alternative to cookies using localStorage

    // sets user object in state, shared via context
    const handleUpdateUser = (user) => {
        if (user.token) {
            setCookie('user', JSON.stringify(user), { path: '/', maxAge: 60 * 60 * 24 }) // cookie will expire in 24 hours
            // localStorage.setItem('user', JSON.stringify(user)); // alternative to cookies using localStorage
        } else {
            removeCookie('user')
            // localStorage.removeItem('user'); // alternative to cookies using localStorage
        }        
        setCurrentUser(user);
    };

    // 2. Provide the context.
    // The Provider component of any context (UserContext.Provider)
    // sends data via its value prop to all children at every level.
    // We are sending both the current user and an update function
    return (
        <UserContext.Provider value={{ currentUser, handleUpdateUser }}>
            {props.children}
        </UserContext.Provider>
    );
};

// 3. Use the context. This custom hook allows easy access
// of this particular context from any child component
export const useUserContext = () => {
    return useContext(UserContext);
};
