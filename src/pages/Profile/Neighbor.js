import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../apis/api';
import NeighborCardList from '../../components/Profile/NeighborCardList';

const Neighbor = () => {

  const [activeTab, setActiveTab] = useState('follow');
  const [followList, setFollowList] = useState([]);
  const [followerList, setFollowerList] = useState([]);
  const { searchId } = useParams();

  const fetchFollowList = async () => {
    try {
      const response = await API.get(`/user/neighbor/${searchId}/from`)
      setFollowList(response.data);
      console.log('followList', followList)
    } catch (error) {
      console.error("팔로우 목록 에러", error);
    }
  }

  const fetchFollowerList = async () => {
    try {
      const response = await API.get(`/user/neighbor/${searchId}/to`)
      setFollowerList(response.data);
      console.log('followerList', followerList)
    } catch (error) {
      console.error("팔로워 목록 에러", error);
    }
  }

  useEffect(() => {
    if (activeTab === 'follow') {
      fetchFollowList();
    } else {
      fetchFollowerList();
    }
  }, [activeTab, searchId]);

  return (
    <div>
      <h3>이웃 목록</h3>
      <div>
        <button className={activeTab === 'follow' ? 'active' : ''} onClick={() => setActiveTab('follow')}>팔로우</button>
        <button className={activeTab === 'follower' ? 'active' : ''} onClick={() => setActiveTab('follower')}>팔로워</button>
      </div>
      
      {activeTab === 'follow' && (
        <>
          <h5>팔로우 목록</h5>
          <NeighborCardList 
            users={followList}
          />
        </>
      )}
      
      {activeTab === 'follower' && (
        <>
          <h5>팔로워 목록</h5>
          <NeighborCardList 
            users={followerList}
          />
        </>
      )}
    </div>
  )
}

export default Neighbor;