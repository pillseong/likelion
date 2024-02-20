// TaskEdit.js

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import cookie from 'react-cookies';
import './TaskEdit.css';
import fileImg from '../Introduction/image 3.png';

import LogoHeader from '../Main/header/LogoHeader';
import MenuHeader from '../Main/header/MenuHeader';



const TaskEdit = () => {
  const address = "https://port-0-likelion-12th-backend-9zxht12blqj9n2fu.sel4.cloudtype.app";
  const navigate = useNavigate();
 

  const [file, setFile] = useState(null);
  const currentUrl = window.location.href;
  let lastSegment = currentUrl.match(/[^/]+$/)[0];
  lastSegment = parseInt(lastSegment, 10);
  let abc = lastSegment + 1
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const date = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');
  
  const currentDateTime = `${year}-${month}-${date}T${hour}:${minute}:${second}`;
  
  console.log(currentDateTime);

  const [newAssignmentData, setNewAssignmentData] = useState({
    student_id: 20201816,
    weeks: abc, // URL에서 추출한 주차 정보
    assignment_title: "name",
    file: {},
    submission_time: currentDateTime,
  });
  console.log(lastSegment);
  console.log(newAssignmentData);

  //--------------------------------------------------------------
  const LoginAddress = 
  // "https://port-0-djangoproject-umnqdut2blqqevwyb.sel4.cloudtype.app/login/";
  "http://15.164.190.171/login/";

  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  const [userName, setUserName] = useState(null);
  const [userDivision, setUserDivision] = useState(null);
  const [student_Id, setStudent_Id] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const savedAccessToken = cookie.load("accessToken");
        const savedRefreshToken = cookie.load("refreshToken");
        setRefreshToken(savedRefreshToken);
        setAccessToken(savedAccessToken);
  
        console.log("Trying to get access token...");
  
        const getAccessTokenResponse = await axios.post(
          `${LoginAddress}`,
          {
            access: savedAccessToken,
            refresh: savedRefreshToken,
          }
        );
  
        setUserName(getAccessTokenResponse.data.name);
        setUserDivision(getAccessTokenResponse.data.division);
        setStudent_Id(getAccessTokenResponse.data.username)
        console.log(getAccessTokenResponse.data.name);
        console.log(getAccessTokenResponse.data.username);
        console.log(getAccessTokenResponse.data.division);
        
        
        cookie.save("accessToken", getAccessTokenResponse.data.access, {
          path: "/",
          expires: new Date(getAccessTokenResponse.data.expires),
        });
      } catch (error) {
        console.error("Error checking access token:", error);
      }
    };
  
    // Call fetchData function
    fetchData();
  }, []);

  useEffect(() => {
    const fetchDataWrapper = async () => {
      const savedAccessToken = await cookie.load('accessToken');
      const savedRefreshToken = await cookie.load('refreshToken');

      setAccessToken(savedAccessToken);
      setRefreshToken(savedRefreshToken);


      // Assuming fetchData is a function that you've defined elsewhere
      // await fetchData(accessAddress, savedAccessToken, savedRefreshToken, setAccessToken, setRefreshToken);
    };

    fetchDataWrapper();
  }, []);
  //-----------------------------------------------------------
  
  const handleFileChange = (e) => {
    // 파일을 선택했을 때 호출되는 함수
    const selectedFile = e.target.files[0]; // 선택된 파일
    setFile(selectedFile); // 파일 상태 업데이트
  };
  const handleAssignmentSubmit = async () => {
    try {
      const formData = new FormData(); // FormData 객체 생성
      formData.append('file', file); // 선택된 파일을 FormData에 추가
      formData.append('student_id', newAssignmentData.student_id); // student_id 추가
      formData.append('weeks', newAssignmentData.weeks); // weeks 추가
      formData.append('submission_time', currentDateTime); // submission_time 추가
  
      // 서버에 FormData를 전송하여 파일 업로드 요청 보내기
      const response = await axios.post(`${address}/assignment/`, formData);
      console.log('Assignment submitted successfully:', response.data);
      navigate('/Task'); // 제출 후 필요한 작업 수행
      
    if (response.status === 200) {
      console.log('과제가 성공적으로 제출되었습니다:', response.data);
      navigate('/Task'); // 성공적인 경우에만 네비게이션 진행
    } else {
      console.error('과제 제출 중 오류 발생. 서버 응답:', response);
      // 에러 상황에 대한 처리를 추가하거나 필요에 따라 알림을 표시할 수 있습니다.
    }
    } catch (error) {
      console.error('과제 제출 중 오류 발생', error);
      console.log(error.response);
      // 오류 처리
    }
  };



  return (
    <div>
      <LogoHeader />
      <MenuHeader />
      <div className='Task__edit__main__container'>
        <h2 className='Task__edit__header__title'>주차</h2>
        <div className='task__edit__header__weeks'>
          <span className='task__edit__header__write'>{lastSegment + 1}</span>
        </div>
        <form>
        <label className="file__input__label">
          <input type="file" onChange={handleFileChange} className="task__input__form" />
          <img src={fileImg} alt="File Upload" className="file_input_image" />
          <span className='file__input__name'>FILE</span>
        </label>
          {/* 기타 입력 필드 추가 (주차, 년도/시간은 자동으로 설정) */}

          <button type="button" onClick={handleAssignmentSubmit} className='task__plus__button'>
            <span className='task__add__button'>ADD</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskEdit;