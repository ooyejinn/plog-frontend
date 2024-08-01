import React from 'react';
import Img from '../../components/Common/Img';
import DiaryDetailContent from '../../components/Diary/DiaryDetailContent';

const PlantGuide = () => {
  //임시 데이터
  const plantData = {
    plantTypeId: 1,
    otherPlantTypeId: 0,
    plantName: '몬스테라',
    profile: 'https://via.placeholder.com/300',
    info: '몬스테라는 병충해 어쩌구 저쩌구' 
  };

  return (
    <div>
      <h2>{plantData.plantName} 키우기</h2>
      <Img src={plantData.profile} alt={`식물이미지`} />
      <DiaryDetailContent detailContent={plantData.info} />
    </div>
  );
};

export default PlantGuide;
