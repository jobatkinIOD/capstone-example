import axios from "axios"
import { useEffect, useState } from "react"
import { useUserContext } from "../context/UserContext"

function UserList() {

    const [users, setUsers] = useState([])
    const [message, setMessage] = useState('')
    const {currentUser} = useUserContext();
    const headers = { "x-access-token": currentUser.token }

    useEffect(() => {
        axios.get('/api/users', {headers: headers})
            .then(response => { setUsers(response.data.data); setMessage(response.data.result); })
            .catch(err => setMessage(err.message))
    },[])

    return (
        <div className="UserList">
            <ul>
            {users.map(user => (
                <li key={user.id}>{user.firstName} {user.lastName}</li>
            ))}
            </ul>
            {message}
        </div>
    )
}

export default UserList