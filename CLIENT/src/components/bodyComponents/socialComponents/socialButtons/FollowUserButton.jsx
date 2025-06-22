import React from 'react';

//Hooks
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';

//Context
import { useGlobalSuperAdminSettings } from '../../../../context/SuperAdminSettingsProvider';
import { useGlobalAdminSettings } from '../../../../context/AdminSettingsProvider';

//Translation
import { useTranslation } from 'react-i18next';


const FollowUserButton = ({ followersAndFollowee, setFollowersAndFollowee, followeeId, followerId, userLoggedInObject, setError, isSuperAdmin }) => {

  // console.log("userL ob", userLoggedInObject)
  const { t } = useTranslation();
  const BACKEND = process.env.REACT_APP_BACKEND_URL;
  const axiosPrivate = useAxiosPrivate();
  const { superAdminSettings } = useGlobalSuperAdminSettings();
  const { adminSettings } = useGlobalAdminSettings();

  const amFollowingThem = followersAndFollowee.some(follower =>
    follower.follower_id === followerId && follower.followee_id === followeeId && follower.status === 'accepted'
  );

  const amBeingFollowedByThem = followersAndFollowee.some(follower =>
    follower.follower_id === followeeId && follower.followee_id === followerId && follower.status === 'accepted'
  );

  const pendingAcceptMe = followersAndFollowee.some(follower =>
    follower.follower_id === followerId && follower.followee_id === followeeId && follower.status === 'pending'
  );

  const pendingAcceptThem = followersAndFollowee.some(follower =>
    follower.followee_id === followerId && follower.follower_id === followeeId && follower.status === 'pending'
  );

  const followUser = (followeeId, followerId) => {

    const data = {
      followeeId: followeeId,
      followerId: followerId,
      user: userLoggedInObject,
      date: new Date()
    };

    axiosPrivate.post(`${BACKEND}/social/users/follow`, data)
      .then(response => {

        const newFollower = response.data;

        // Check if the new follower already exists in the state
        const existingFollowerIndex = followersAndFollowee.findIndex(follower =>
          follower.follower_id === newFollower.follower_id &&
          follower.followee_id === newFollower.followee_id
        );

        // If an existing follower is found, replace it with the new follower
        if (existingFollowerIndex !== -1) {
          const updatedFollowers = [...followersAndFollowee];
          updatedFollowers[existingFollowerIndex] = newFollower;
          setFollowersAndFollowee(updatedFollowers);
          // console.log('Follower replaced in state:', newFollower);
        } else {
          // If no existing follower found, add the new follower to the state
          setFollowersAndFollowee(prevFollowers => [...prevFollowers, newFollower]);
        }

        setError(null);

      })
      .catch(error => {
        console.error(t('followUserButton.errorSendFollow'), error);
        setError(t('followUserButton.errorSendFollow'));
      });

  };


  // Function to unfollow a user
  const unfollowUser = (followeeId, followerId) => {

    const data = {
      followeeId: followeeId,
      followerId: followerId,
      user: userLoggedInObject
    };

    axiosPrivate.delete(`${BACKEND}/social/users/unfollow`, { data: data })

      .then(response => {


        const removedFollower = response.data;

        // Remove the unfollowed user from the state
        const updatedFollowers = followersAndFollowee.filter(follower =>
          !(follower.follower_id === removedFollower.follower_id &&
            follower.followee_id === removedFollower.followee_id)
        );

        setFollowersAndFollowee(updatedFollowers);
        setError(null);
      })
      .catch(error => {
        console.error(t('followUserButton.errorUnfollow'), error);
        setError(t('followUserButton.errorUnfollow'));
      });
  };

  const approveFollower = (followeeId, followerId) => {
    const data = {
      followeeId: followeeId,
      followerId: followerId,
      user: userLoggedInObject,
      date: new Date()
    };

    axiosPrivate.post(`${BACKEND}/social/users/approvefollower`, data)
      .then(response => {
        const newFollower = response.data;

        const existingFollowerIndex = followersAndFollowee.findIndex(follower =>
          follower.follower_id === newFollower.follower_id &&
          follower.followee_id === newFollower.followee_id
        );

        if (existingFollowerIndex !== -1) {
          const updatedFollowers = [...followersAndFollowee];
          updatedFollowers[existingFollowerIndex] = newFollower;
          setFollowersAndFollowee(updatedFollowers);
        } else {
          setFollowersAndFollowee(prevFollowers => [...prevFollowers, newFollower]);
        }

        setError(null);

      })
      .catch(error => {
        console.error(t('followUserButton.errorApproveFollower'), error);
        setError(t('followUserButton.errorApproveFollower'));
      });
  };

  const cancelFollowRequest = (followeeId, followerId) => {
    const data = {
      followeeId: followeeId,
      followerId: followerId,
      user: userLoggedInObject
    };

    axiosPrivate.delete(`${BACKEND}/social/users/cancel-follow`, { data: data })
      .then(response => {
        const canceledFollower = response.data;

        // Remove the canceled follower from the state
        const updatedFollowers = followersAndFollowee.filter(follower =>
          !(follower.follower_id === canceledFollower.follower_id &&
            follower.followee_id === canceledFollower.followee_id)
        );
        setFollowersAndFollowee(updatedFollowers);
        setError(null);
      })
      .catch(error => {
        console.error(t('followUserButton.errorCancelRequest'), error);
        setError(t('followUserButton.errorCancelRequest'));
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

    (superAdminSettings.allowFollow && adminSettings.allowFollow || isSuperAdmin) &&
    <div
      className="user-info-buttons"
    >


      {!amFollowingThem && !pendingAcceptMe && !amBeingFollowedByThem && <button
        onClick={handleFollow}>{t('followUserButton.follow')}</button>}

      {amFollowingThem && <button
        onClick={handleUnfollow}>{t('followUserButton.unfollow')}</button>}

      {!amFollowingThem && amBeingFollowedByThem && !pendingAcceptMe && <button
        onClick={handleFollow}>{t('followUserButton.followBack')}</button>}

      {pendingAcceptMe && <button
        onClick={handleCancelRequest}>{t('followUserButton.cancelRequest')}</button>}

      {pendingAcceptThem && <button
        onClick={() => { approveFollower(followeeId, followerId) }}>{t('followUserButton.approveRequest')}</button>}

    </div>





  );
};

export default FollowUserButton;
