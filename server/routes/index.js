const fetchUser = () => {
      return async (dispatch, getState) => {
            const users = await getUsersAsync();
            dispatch({ type: 'FETCH_USER', payload: users });
      };
};