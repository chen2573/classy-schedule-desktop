import {React} from 'react';
import {Link} from 'react-router-dom';

export function home ()
{
    
    return (
    <div className="main-div">
        <h1>Classy Schedule Home</h1>
    <h5>This will be our home page</h5>
    <button type="button">
        <Link to='/'>Home</Link>
    </button>
    <button type="button"> 
        <Link to='/professor'>Add Professor</Link>
    </button>
    <button type="button"> 
        <Link to='/course'>Add Course</Link>
    </button>
    <button type="button"> 
        <Link to='/room'>Add Room</Link>
    </button>
    <button type="button"> 
        <Link to='/schedule'>Add Schedule</Link>
    </button>
    </div>
    );
}

export default home;