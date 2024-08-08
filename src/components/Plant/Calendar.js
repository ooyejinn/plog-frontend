import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { useNavigate } from 'react-router-dom';
import './Calendar.css';
import API from '../../apis/api';

const CustomCalendar = ({ plantId }) => {
  const [value, setValue] = useState(new Date());
  const [checkRecords, setCheckRecords] = useState([]);
  const [diaryRecords, setDiaryRecords] = useState([]);
  const navigate = useNavigate();

  const fetchMonthData = async (year, month) => {
    try {
      const checkResponse = await API.get(`/user/plant/${plantId}/check`, {
        params: { year, month },
      });
      
      const diaryResponse = await API.get(`/user/plant/${plantId}/diary`, {
        params: { year, month },
      });

      return { checkData: checkResponse.data, diaryData: diaryResponse.data };
    } catch (error) {
      console.error('Error fetching month data:', error.response.data);
      return { checkData: [], diaryData: [] };
    }
  };

  const fetchRecords = async (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    try {
      const currentData = await fetchMonthData(year, month);

      const prevMonth = month === 1 ? 12 : month - 1;
      const prevYear = month === 1 ? year - 1 : year;
      const prevData = await fetchMonthData(prevYear, prevMonth);

      const nextMonth = month === 12 ? 1 : month + 1;
      const nextYear = month === 12 ? year + 1 : year;
      const nextData = await fetchMonthData(nextYear, nextMonth);

      setCheckRecords([...prevData.checkData, ...currentData.checkData, ...nextData.checkData]);
      setDiaryRecords([...prevData.diaryData, ...currentData.diaryData, ...nextData.diaryData]);
    } catch (error) {
      console.error("Calendar Error:", error);
    }
  };

  useEffect(() => {
    fetchRecords(value);
  }, [value, plantId]);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleClickDay = (date) => {
    const formattedDate = formatDate(date);
    const diaryRecord = diaryRecords.find(diary => new Date(diary.recordDate).toDateString() === date.toDateString());
    const checkRecord = checkRecords.find(check => new Date(check.checkDate).toDateString() === date.toDateString());
    if (diaryRecord || checkRecord) {
      navigate(`/plant/${plantId}/${formattedDate}`, {
        state: {
          date: formattedDate,
          plantId: plantId
        }
        });
    } else {
      navigate(`/plant/${plantId}/${formattedDate}/write`, {
        state: {
          date: formattedDate,
          plantId: plantId
        }
      });
    }
  };


  const today = new Date();

  const colorBox = ({ date }) => {
    const checkRecord = checkRecords.find(record => new Date(record.checkDate).toDateString() === date.toDateString());
    const diaryRecord = diaryRecords.find(diary => new Date(diary.recordDate).toDateString() === date.toDateString());

    return (
      <div className="color-box">
        <div className={`indicator ${checkRecord?.watered ? 'watered' : ''}`}></div>
        <div className={`indicator ${checkRecord?.fertilized ? 'fertilized' : ''}`}></div>
        <div className={`indicator ${checkRecord?.repotted ? 'repotted' : ''}`}></div>
        <div className={`indicator ${diaryRecord ? 'diary' : ''}`}></div>
      </div>
    );
  };

  return (
    <div>
      <Calendar
        onChange={(date) => {
          setValue(date);
          fetchRecords(date);
        }}
        value={value}
        tileContent={colorBox}
        onClickDay={handleClickDay}
        onActiveStartDateChange={({ activeStartDate }) => {
          setValue(activeStartDate);
          fetchRecords(activeStartDate);
        }}
        maxDate={today}
      />
    </div>
  );
};

export default CustomCalendar;
