import React from 'react';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';

const FollowUserButton = ({ followers, setFollowers, followeeId, followerId, userLoggedInObject }) => {


  const BACKEND = process.env.REACT_APP_API_URL;
  const axiosPrivate = useAxiosPrivate()

  const amFollowingThem = followers.some(follower =>
    follower.follower_id === followerId && follower.followee_id === followeeId && follower.status === 'accepted'
  );

  const amBeingFollowedByThem = followers.some(follower =>
    follower.follower_id === followeeId && follower.followee_id === followerId && follower.status === 'accepted'
  );

  const pendingAcceptMe = followers.some(follower =>
    follower.follower_id === followerId && follower.followee_id === followeeId && follower.status === 'pending'
  );

  const pendingAcceptThem = followers.some(follower =>
    follower.followee_id === followerId && follower.follower_id === followeeId && follower.status === 'pending'
  );

  const followUser = (followeeId, followerId) => {

    const data = {
      followeeId: followeeId,
      followerId: followerId,
      user: userLoggedInObject,
      date: new Date()
    };

    axiosPrivate.post(`${BACKEND}/users/follow`, data)
      .then(response => {

        const newFollower = response.data;

        // Check if the new follower already exists in the state
        const existingFollowerIndex = followers.findIndex(follower =>
          follower.follower_id === newFollower.follower_id &&
          follower.followee_id === newFollower.followee_id
        );

        // If an existing follower is found, replace it with the new follower
        if (existingFollowerIndex !== -1) {
          const updatedFollowers = [...followers];
          updatedFollowers[existingFollowerIndex] = newFollower;
          setFollowers(updatedFollowers);
          // console.log('Follower replaced in state:', newFollower);
        } else {
          // If no existing follower found, add the new follower to the state
          setFollowers(prevFollowers => [...prevFollowers, newFollower]);
        }

      })
      .catch(error => {
        console.error('Error sending follow request:', error);
      });

  };


  // Function to unfollow a user
  const unfollowUser = (followeeId, followerId) => {

    const data = {
      followeeId: followeeId,
      followerId: followerId,
      user: userLoggedInObject
    };

    axiosPrivate.post(`${BACKEND}/users/unfollow`, data)
      .then(response => {


        const removedFollower = response.data;

        // Remove the unfollowed user from the state
        const updatedFollowers = followers.filter(follower =>
          !(follower.follower_id === removedFollower.follower_id &&
            follower.followee_id === removedFollower.followee_id)
        );

        setFollowers(updatedFollowers);
      })
      .catch(error => {
        console.error('Error sending unfollow request:', error);
      });
  };

  const approveFollower = (followeeId, followerId) => {
    const data = {
      followeeId: followeeId,
      followerId: followerId,
      user: userLoggedInObject,
      date: new Date()
    };

    axiosPrivate.post(`${BACKEND}/users/approvefollower`, data)
      .then(response => {
        const newFollower = response.data;

        const existingFollowerIndex = followers.findIndex(follower =>
          follower.follower_id === newFollower.follower_id &&
          follower.followee_id === newFollower.followee_id
        );

        if (existingFollowerIndex !== -1) {
          const updatedFollowers = [...followers];
          updatedFollowers[existingFollowerIndex] = newFollower;
          setFollowers(updatedFollowers);
        } else {
          setFollowers(prevFollowers => [...prevFollowers, newFollower]);
        }
      })
      .catch(error => {
        console.error('Error approving follower:', error);
      });
  };

  const cancelFollowRequest = (followeeId, followerId) => {
    const data = {
      followeeId: followeeId,
      followerId: followerId,
      user: userLoggedInObject
    };

    axiosPrivate.delete(`${BACKEND}/users/cancel-follow`, { data: data })
      .then(response => {
        const canceledFollower = response.data;

        // Remove the canceled follower from the state
        const updatedFollowers = followers.filter(follower =>
          !(follower.follower_id === canceledFollower.follower_id &&
            follower.followee_id === canceledFollower.followee_id)
        );
        setFollowers(updatedFollowers);
      })
      .catch(error => {
        console.error('Error canceling follow request:', error);
      });
  };


  const handleFollow = () => {
    followUser(followeeId, followerId);
  };

  const handleUnfollow = () => {
    unfollowUser(followeeId, followerId);
  };

  const handleCancelRequest = () => {
    cancelFollowRequest(followeeId, followerId);
  }

  return (
    <>


      {!amFollowingThem && !pendingAcceptMe && !amBeingFollowedByThem && <button onClick={handleFollow}>Follow</button>}

      {amFollowingThem && <button onClick={handleUnfollow}>Unfollow</button>}

      {!amFollowingThem && amBeingFollowedByThem && !pendingAcceptMe && <button onClick={handleFollow}>Follow back</button>}

      {pendingAcceptMe && <button onClick={handleCancelRequest}>Cancel request</button>}

      {pendingAcceptThem && <button onClick={() => { approveFollower(followeeId, followerId) }}>Approve request</button>}

    </>



  );
};

export default FollowUserButton;
