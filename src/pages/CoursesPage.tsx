import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { createSession } from '../services/sessionServices';
import { getLectureInfo } from '../services/recordingServices';

interface Course {
  name: string;
  lecturer: string;
  length: string;
  filename: string;
date: Date;
channelCode: string;
}


const Courses: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);

  const handleJoin = (videoUrl: string,channelCode:string) => {
    const withoutextention = videoUrl.split('.').slice(0, -1).join('.');
    navigate(`/player/${withoutextention}/${channelCode}`);
  };

  const getFilenames = async () => {
    setCourses([]);
    const lectures = await getLectureInfo();
    console.log(lectures);
    for (let lecture of lectures) {
      if(lecture.recordings.length > 0) {
        for (let recording of lecture.recordings) {
          if(recording.end == null) continue;
          //if courses has a course with the same filename, skip
          const a =  (new Date (new Date(recording.end).getTime()-(new Date(recording.start)).getTime()))
          let course = {
            name: lecture.channelName,
            lecturer: lecture.lecturer.username,
            //recording.start-recording.end
            length: `${a.getUTCHours()}:${a.getUTCMinutes()}:${a.getUTCSeconds()}`,
            filename: recording.url,
            date: new Date(recording.start),
            channelCode: lecture.shareUrl,
          }
          setCourses(filenames => [...filenames, course]);
        }
      }
    }
  };
    
  

  useEffect(() => {
    const bucketName = 'edu-recordings';

    getFilenames()
      .then((result) => {
        
      })
      .catch((error) => {
        console.error('Error retrieving filenames:', error);
      });
  }, []);



  const  handleAnalytics = (lecture: any): void => {
    console.log(lecture);
    navigate(`/stats/${lecture}`);
  }

  return (
    <>
      <Header />

      <div className="w3-container">
        <h2>Video Catalogue</h2>
        

            <div className="w3-row">
              {courses.map((course) => (
                <div key={course.filename} className="w3-col l3 m6 w3-margin-bottom">
                  <div className='w3-col l3 m6 w3-margin-bottom'>
              <div className='w3-card w3-margin w3-light-grey w3-padding w3-card w3-round' style={{minWidth:'300px'}}>
                {/* <img src={`https://edu-recordings.s3.amazonaws.com/${course.filename}`} alt={course.name} style={{ width: '100%' }} /> */}
                
                <div className='w3-container w3-round' >
                  <h4>{course.name}</h4>
                  <p>Lecturer: {course.lecturer}</p>
                  <p>Length: {course.length}</p>

                  <button className='w3-button w3-blue ' onClick={() => handleJoin(course.filename, course.channelCode)}>
                    Join Course
                  </button>
                  <button className='w3-button w3-green ' onClick={() => handleAnalytics(course.channelCode)}>
                    View Analytics
                  </button>
                </div>
              </div>
            </div>
                </div>
              ))}
            </div>
      </div>
    </>
  );
};

export default Courses;
