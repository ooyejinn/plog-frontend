import React, { useState, useEffect } from 'react';
import useAuthStore from '../../stores/member';
import ProfileUpdateForm from '../../components/Account/ProfileUpdateForm';
import './Account.css';

const ProfileUpdate = () => {

  return (
    <div className="account-signup-container">
      <h1 className="account-title mt-20 mr-3">회원정보 수정</h1>
      <ProfileUpdateForm />
    </div>
  );
}

export default ProfileUpdate;
