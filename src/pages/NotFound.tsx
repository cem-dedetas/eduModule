//not found page styled with w3css

import React from 'react';
const NotFound: React.FC = () => {
    return (
        
        <div className="w3-container" style={{display:'flex', alignItems:'center', justifyContent:'center', height:'100%'}}>
            <div className="w3-card-4 w3-margin w3-padding w3-half" style={{minHeight:'300px', justifyContent:'center'}}>
                <img src="https://abl.gtu.edu.tr/html/mobil/gtu_logo_tr_500.png" style={{width:'50%'}}></img>
                <h1 className='w3-text-indigo'>Education Portal</h1>
                <img src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif" style={{width:'50%'}}></img>
                <h3>404 Not Found</h3>
                <p>The page you are looking for does not exist.</p>
            </div>
        </div>
        
    );
}

export default NotFound;