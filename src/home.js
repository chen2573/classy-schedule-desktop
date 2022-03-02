import {React} from 'react';

export function home ()
{
    const temp = 'yo';
    
    return (
    <div className="main-div">
        <h1>{temp}</h1>
        <h1>Classy Schedule Home</h1>
    <h5>This will be our home page</h5>

    <button type="button"> 
        <a href="professor.html">
            Add Professor
        </a>
    </button>
    <button type="button"> 
        <a href="class.html">
            Add Class
        </a>
    </button>
    <button type="button"> 
        <a href="room.html">
            Add Room
        </a>
    </button>
    <button type="button"> 
        <a href="solution.html">
            Get Schedule
        </a>
    </button>
    </div>
    );
}

export default home;