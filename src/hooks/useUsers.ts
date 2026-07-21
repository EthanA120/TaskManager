import { useState, useCallback, useContext } from "react";
import { getUsers as getUsersFromDb } from "../services/usersDataServiceFireBase";
import { SnackContext } from "../providers/SnackProvider";
import type { User } from "../types/User";

function useUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const { raiseSnack } = useContext(SnackContext) as any;

    const handleGetUsers = useCallback(async () => {
        try {
            const allUsers = await getUsersFromDb();
            setUsers(allUsers);
        } catch (error) {
            raiseSnack("error", "Failed to fetch users");
        }
    }, [raiseSnack]);

    return { users, handleGetUsers };
}

export default useUsers;