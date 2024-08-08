import React, {useState, useEffect} from 'react';
import useAuthStore from '../../stores/member';
import API from '../../apis/api';


/* TODO: 추후 유저 프로필을 구현하게 될 때
  요청 유저와 페이지 유저의 관계를 체크 후 관계에 따라 다르게 렌더해야 함

  1. 본인일 경우 : 북마크 아이콘
  2. 이웃이 아닐 경우 : 이웃 신청 Btn
  3. 이웃일 경우 : 서로이웃 신청 Btn, 이웃 취소 Btn
  4. 서로이웃일 경우 : 이웃 취소 Btn
    (추후 모달로 이웃으로 전환, 완전히 이웃 끊기 선택지 제공)
*/

const ProfileHeaderUserBtnList = ({ ownerId }) => {
  const authSearchId = useAuthStore((state) => state.getSearchId());

  const [profileUserRel, setProfileUserRel] = useState(null);
  const [requestUserRel, setRequestUserRel] = useState(null);

  useEffect(() => {
    const fetchRel = async () => {
      try {
        const response = await API.get(`/user/neighbor/${ownerId}`);
        setProfileUserRel(response.data.profileUserRel);
        setRequestUserRel(response.data.requestUserRel);
        // console.log('@@@ProfileUserRel:@@@', response.data);
      } catch (error) {
        console.error('@@@Rel Error:', error, '@@@');
      }
    };

    if (authSearchId) {
      fetchRel();
    }
  }, [authSearchId, ownerId]);


  if (profileUserRel === null || requestUserRel === null) {
    return null;
  }

  const getProfileUserRelText = () => {
    if (profileUserRel === 1) return ownerId, `${ownerId}님은 당신을 이웃으로 추가하고 있습니다.`;
    if (profileUserRel === 2) return `${ownerId}님은 당신과 서로이웃 입니다.`;
    return '';
  };

  return (
    <div>
      {authSearchId === ownerId && (
        <button>🔖</button>
      )}
      <span>
        {getProfileUserRelText()}
      </span>
      <div>
        {requestUserRel === 0 && (
          <button style={{ margin: '10px' }}>이웃 신청</button>
        )}
        {requestUserRel === 1 && (
          <>
            <button style={{ margin: '10px' }}>서로이웃 신청</button>
            <button style={{ margin: '10px' }}>이웃 끊기</button>
          </>
        )}
        {requestUserRel === 2 && (
          <button style={{ margin: '10px' }}>이웃 끊기</button>
        )}
      </div>
    </div>
  );
};

export default ProfileHeaderUserBtnList;