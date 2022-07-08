import { useCallback, useState } from 'react';
import { User, UserService } from 'tato_ap-sdk';

export default function useUser() {
  const [user, setUser] = useState<User.Detailed>();

  const fetchUser = useCallback((id: number) => {
    UserService.getDetailedUser(id).then(setUser);
  }, []);

  return {
    user,
    fetchUser,
  };
}
