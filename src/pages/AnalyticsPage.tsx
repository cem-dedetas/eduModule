import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useNavigate, useParams } from 'react-router-dom';
import { getChannelStats, getLecture,getChatLog } from '../services/recordingServices';


const Analytics: React.FC = () => {
    // useState for data

    const { channelCode } = useParams();
    const [stats, setStats] = useState<any>(null);
    const [lecture, setLecture] = useState<any>(null);
    const navigate = useNavigate();
    useEffect(() => {
        // get channel stats
        getChannelStats(channelCode).then((res) => {
            setStats(res);
            console.log(res)
            //data has fields: ["averageWatchTime","totalWatchTime","totalViews","viewers": viewers array]
            //example viewer:
            /**
             * {
            "id": 1,
            "username": "cemdedetas",
            "id_number": "111111111",
            "password_hash": "9b7qiDS+E6sOm858qwl+urf2wcQ5AiPG/E+cmUWoo3T6NdJk7amcvo0Ij54xcirNUcd/U8P16xl7ITAZQWCedw==",
            "password_salt": "Gue/Qv/nBeFci6Q2XDszXDAAWHcercfpccWZllfrs0Rp6pFtV9U9ktQNNGHnV0Ci+Gmu6I5RqWZnsD3JHRGtW7gHpsLALdzd2VM7Q6cx1CUn5wwQ2HiFUtaZIXJLObLTLTby2EoJVriAgt32+zwoCY8+xasdPlBuaAMQ0UtJCRU=",
            "email": "cemdedetas@gmail.com",
            "token": null
        },
             */
        }).catch((err) => {
            console.log(err);
        })

        getLecture(channelCode).then((res) => {
            setLecture(res);
            console.log(res)
        
        }).catch((err) => {
            console.log(err);
        }
        )
    }, [])

    const handleDownload = async () => {
        try {
          // Make a request to the backend endpoint to download the file
          const data = await getChatLog(channelCode);
          //data.fileContents is the encoded file contents
            //data.fileDownloadName is the file name
            // data.contentType is the file type

            // Decode the base64 file contents
            const fileContents = atob(data.fileContents);
            
            // Create a blob object from the decoded file contents
            const fileBlob = new Blob([fileContents], { type: data.contentType });

            console.log(fileBlob)
          // Create a URL for the file blob
          const fileUrl = URL.createObjectURL(fileBlob);
    
          // Create a link element to trigger the download
          const link = document.createElement('a');
          link.href = fileUrl;
          link.download = data.fileDownloadName;
          document.body.appendChild(link);
    
          // Click the link to initiate the download
          link.click();
    
          // Remove the link from the DOM
          document.body.removeChild(link);
        } catch (error) {
          console.error('Error downloading the file:', error);
        }
      };
    //display these infos
    return (
        <>
        <Header></Header>
            <div className="w3-container w3-card" style={{display:'flex' , flexDirection:'column', alignItems:'flex-start'}}>
            <h1 className="w3-text-teal">Analytics</h1>
              <h2 className="w3-text-black w3-padding">Lecture Name: {lecture?.channelName}</h2>
              <h2 className="w3-text-black w3-padding">Lecture Date: {(new Date(lecture?.date)).toLocaleString()}</h2>
              <h2 className="w3-text-black w3-padding">Lecturer: {lecture?.lecturer.username}</h2>
    
              {lecture?.tags && (
                <>
                  <h2 className="w3-text-black w3-padding">Lecture Tags:</h2>
                  <ul className="w3-ul w3-padding">
                    {lecture?.tags.map((tag: any) => {
                      return <li key={tag.id} className="w3-text-blue">{tag.tag_name}</li>;
                    })}
                  </ul>
                </>
              )}
    
              <h2 className="w3-text-black w3-padding">Lecture Description: {lecture?.description}</h2>
              <h2 className="w3-text-black w3-padding">Channel Code: {channelCode}</h2>
              <h2 className="w3-text-black w3-padding">Total Views: {stats?.totalViews} (lecturer included)</h2>
              <h2 className="w3-text-black w3-padding">Total Watch Time: {stats?.totalWatchTime.toFixed(2)}</h2>
              <h2 className="w3-text-black w3-padding">Average Watch Time: {stats?.averageWatchTime.toFixed(2)}</h2>
              <h2 className="w3-text-black w3-padding">Viewers:</h2>
              {/* //display viewers as inline list with bullet points */}
                <ul className="w3-ul w3-padding" style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    alignContent: 'flex-start',
                    listStyleType: 'disc',
                    margin: 0,
                    padding: 0,
                    width: '100%',
                    height: '100%',
                    boxSizing: 'border-box',
                    overflow: 'auto',
                    backgroundColor: 'white',
                    color: 'black',
                 }}>
                {stats?.viewers.map((viewer: any) => {
                  return <li key={viewer.id} className="w3-text-blue" style={{}}>{viewer.user.username}{` (${viewer.minutesWatched.toFixed(2)} minutes)`}</li>;
                })}
                </ul>

            </div>
    
            <div className="w3-container w3-card w3-padding">
              <button className="w3-btn w3-blue w3-margin-right" onClick={() => { navigate(-1) }}>
                Go to Lecture Page
              </button>
              <button className="w3-btn w3-green" onClick={handleDownload}>
                Download Chat Log
              </button>
            </div></>
      );
    
}
export default Analytics;
