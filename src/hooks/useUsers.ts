import { useState, useCallback, useContext } from "react";
import { getUsers as getUsersFromDb, updateUser as updateUserInDb } from "../services/usersDataServiceFireBase";
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

    const handleUpdateUser = useCallback(async (userId: string, data: Partial<User>) => {
        try {
            await updateUserInDb(userId, data);
            setUsers(prevUsers => 
                prevUsers.map(user => 
                    user.id === userId ? { ...user, ...data } : user
                )
            );
            // Optional: show success snack
        } catch (error) {
            raiseSnack("error", "Failed to update user");
        }
    }, [raiseSnack]);

    return { users, handleGetUsers, handleUpdateUser };
}

export default useUsers;