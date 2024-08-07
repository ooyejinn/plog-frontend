import React, { useState, useEffect } from "react";
import { useNavigate} from 'react-router-dom';
import defaultImg from '../../assets/icon/default.png';

const ProfileSnsCard = ({ articleId, nickname, image, content, likeCnt, commentCnt, isLiked, isBookmarked}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/sns/${articleId}`);
  }

  return (
    <div onClick={handleClick}>
      <img
        src={image || defaultImg}
        alt="thumbnail"
      />
      <p>{content}</p>
      <p>좋아요 수:{likeCnt}</p>
      <p>댓글 수:{commentCnt}</p>
      <i title="좋아요">
        {isLiked ? '❤️' : '🖤'}
      </i>
      <i title="북마크">
      {isBookmarked ? '🔖' : ''}
      </i>
    </div>
  )

}

export default ProfileSnsCard;