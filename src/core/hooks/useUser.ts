import { useCallback, useState } from 'react';
import { User, UserService } from 'tato_ap-sdk';
import ResourceNotFoundError from 'tato_ap-sdk/dist/errors/ResourceNotFound.error';

export default function useUser() {
  const [user, setUser] = useState<User.Detailed>();
  const [notFound, setNotFound] = useState(false);

  const fetchUser = useCallback(async (id: number) => {
    try {
      await UserService.getDetailedUser(id).then(setUser);
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        setNotFound(true);
      } else {
        throw error;
      }
    }
  }, []);

  const toggleUserStatus = useCallback((user: User.Summary | User.Detailed) => {
    return user.active
      ? UserService.desactivateExistingUser(user.id)
      : UserService.activateExistingUser(user.id);
  }, []);

  return {
    user,
    fetchUser,
    notFound,
    toggleUserStatus,
  };
}
