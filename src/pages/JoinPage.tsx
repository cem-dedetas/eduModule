import React from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { createSession } from '../services/sessionServices';


const Join: React.FC = () => {
    //useStates for info
    const [name, setName] = React.useState('');
    const [roomId, setRoomId] = React.useState('');
    const [roomName, setRoomName] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const navigate = useNavigate();

    //onJoin function
    const onJoin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        navigate(`/prejoin/${roomId}`);
        
        
    };

    const onCreate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        createSession(roomName).then((res)=>{
            console.log(res);
            navigate(`/prejoin/${res.shareUrl}`);
        }
        ).catch((err)=>{
            console.log(err);
        }
        )
    };


  //return two cards, with margin between them align horizontally in the center iof the screen w3css
    return (
        <div style={{height:"100%"}}>
        <Header></Header>
        <div className="w3-container" style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
            <div className="w3-card-4 w3-margin w3-padding w3-half w3-round-xlarge w3-light-grey" style={{minHeight:'300px'}}>
                <h3>Join a call</h3>
                <form  onSubmit={(e)=>{onJoin(e)}}>
                    
                    <div className="w3-section">
                        <label>You can join a call, as a participant</label>
                        
                    </div>
                    <div className="w3-section">
                        <label>Room Id</label>
                        <input className="w3-input w3-round-large w3-padding w3-margin-top" type="text" placeholder="Enter Room ID" value={roomId} onChange={(e)=>{
                            setRoomId(e.target.value);
                        }
                        }/>
                    </div>
                    <button type="submit" className="w3-button w3-teal w3-margin-bottom w3-round">Join</button>
                </form>
            </div>
            <div className="w3-card-4 w3-margin w3-padding w3-half w3-round-xlarge w3-light-grey" style={{minHeight:'300px', justifyContent:'center'}}>
                <h3>Create a call</h3>
                <form onSubmit={onCreate}>
                <div className="w3-section">
                        <label>You can create a call, as a Lecturer</label>
                        
                    </div>
                    <div className="w3-section">
                        <label>Room Name</label>
                        <input className="w3-input w3-round-large w3-padding w3-margin-top" type="text" placeholder="Enter Room Name" value={roomName} onChange={(e)=>{
                            setRoomName(e.target.value);
                        }}/>
                    </div>
                    <button type="submit" className="w3-button w3-teal w3-margin-bottom w3-display-bottom w3-round">Create</button>
                </form>
            </div>
        </div>
        </div>

    );
};

export default Join;
