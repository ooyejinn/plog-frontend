import React, { useState, useEffect } from 'react';
import API from '../../apis/api';
import axios from 'axios';
import sha256 from 'js-sha256';
import { useNavigate, useLocation } from 'react-router-dom';

import Btn from '../../components/Common/Btn';
import InputField from '../../components/Common/InputField';
import ATag from '../../components/Common/ATag';
import ModalComplete from '../../components/Common/ModalComplete';
import './Account.css';

const PasswordUpdate = () => {
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  // location
  const location = useLocation();
  const { userId } = location.state;
  // input fields
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  // 변경 버튼 클릭
  const [openModal, setOpenModal] = useState(false);
  // 비밀번호 유효성 확인
  const [passwordError, setPasswordError] = useState('');
  const [passwordConfirmError, setPasswordConfirmError] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);


  // 비밀번호 유효성 검사
  useEffect(() => {
    
    const validatePassword = () => {
      if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,12}$/.test(password)) {
        setPasswordError('올바른 비밀번호 형식이 아닙니다');
      } else {
        setPasswordError('');
      }
    };

    const validatePasswordConfirm = () => {
      if (password !== passwordConfirm) {
        setPasswordConfirmError('비밀번호가 일치하지 않습니다');
      } else {
        setPasswordConfirmError('');
      }
    };

    validatePassword();
    validatePasswordConfirm();

    setIsFormValid(!passwordError && !passwordConfirmError && password && passwordConfirm);
  }, [password, passwordConfirm, passwordError, passwordConfirmError]);


  // 비밀번호 변경 버튼 클릭
  const handlePasswordUpdate = async (event) => {
    event.preventDefault();
    
    // 비밀번호 변경 요청
    try {
      const response = await axios.patch(`${API_BASE_URL}/user/password`, {
        userId,
        password: sha256(password)
      })
      setOpenModal(true);
    } catch (error) {
      console.error('비밀번호 변경 실패:', error);
    }
  };
  
  // 모달
  const closeModal = () => {
    setOpenModal(false);
    navigate('/setting');
  };
  

  return (
    <div className="account-container">
      <h2 className="account-title">비밀번호 변경</h2>
      <form onSubmit={e => e.preventDefault()} className="account-form">
        <div className="password-container">
          <InputField
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            isRequired={true} 
            className="account-input"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="password-toggle"
          >
            {showPassword ? '숨기기' : '보기'}
          </span>
          {passwordError && <p className="account-error">{passwordError}</p>}
        </div>
        <div className="password-container">
          <InputField
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호 확인" 
            value={passwordConfirm} 
            onChange={(e) => setPasswordConfirm(e.target.value)}
            isRequired={true} 
            className="account-input"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="password-toggle"
          >
            {showPassword ? '숨기기' : '보기'}
          </span>
          {passwordConfirmError && <p className="account-error">{passwordConfirmError}</p>}
        </div>
        <Btn
          content="비밀번호 변경"
          disabled={!isFormValid}
          onClick={handlePasswordUpdate}
          className="account-button"
        />
      </form>
      <ModalComplete
        title={'비밀번호 변경 완료'}
        content={'비밀번호 변경이 완료되었습니다'}
        open={openModal}
        onClose={closeModal}
      />
    </div>
  )
}

export default PasswordUpdate;