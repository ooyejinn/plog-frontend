import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import API from "../../apis/api";
import FooterCmt from '../Common/FooterCmt';
import Btn from '../Common/Btn';
import CommentItem from './CommentItem';
import useAuthStore from '../../stores/member';

const Comment = ({ articleId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [commentList, setCommentList] = useState([]);
  const [cmtCnt, setCmtCnt] = useState(0);
  const [selectedParentId, setSelectedParentId] = useState(0);
  const [isFooterCmtActive, setIsFooterCmtActive] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMoreComments, setHasMoreComments] = useState(true); // 추가 상태

  const { userData } = useAuthStore();

  // 댓글 불러오기
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await API.get(`/user/sns/${articleId}/comment`, {
          params: { page },
        });
        if (response.data.length === 0) {
          setHasMoreComments(false);
        } else {
          setCommentList(prevComments => [...prevComments, ...response.data]);
          setCmtCnt(prevCount => prevCount + response.data.length);
        }
        console.log('댓글 불러오기 성공:', response.data);
      } catch (err) {
        console.error('댓글 불러오기 실패 : ', err);
      }
    };

    if (hasMoreComments) {
      fetchComments();
    }
  }, [articleId, page]);

  // 스크롤 이벤트 핸들러
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop + 50 >= document.documentElement.offsetHeight && hasMoreComments) {
        setPage(prevPage => prevPage + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasMoreComments]);

  const handleReply = (parentId) => {
    setSelectedParentId(parentId);
    setIsFooterCmtActive(true);
  };

  return (
    <div>
      <hr />
      <h3>댓글</h3>
      <div>
        {commentList.map((comment) => (
          <CommentItem key={comment.articleCommentId} comment={comment} handleReply={handleReply} />
        ))}
      </div>
      {location.pathname === `/sns/${articleId}` && (
        <Btn 
          content='댓글 자세히 보기'
          onClick={() => navigate(`/sns/${articleId}/comment`, { state: { articleId } })}
          cmtCnt={cmtCnt}
        />
      )}
      <FooterCmt
        articleId={articleId}
        selectedParentId={selectedParentId}
        setSelectedParentId={setSelectedParentId}
        profile={userData.profile}
        setCommentList={setCommentList}
        isActive={isFooterCmtActive}
        setIsActive={setIsFooterCmtActive}
      />
    </div>
  );
};

Comment.propTypes = {
  articleId: PropTypes.number.isRequired,
};

export default Comment;
