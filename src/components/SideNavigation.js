import React from 'react'


/* Set the width of the side navigation to 0 and the right margin of the page content to 0, and the background color of body to white */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginRight = "0";
    document.body.style.backgroundColor = "white";
}

function logoutFromApplication() {
    window.DB.send('toMain:AuthLogOut', "");
}

function createAdmin() {
    let payload = {
      request: 'NEW_ADMIN'
    }

    window.DB.send('toMain:Modal', payload);
}

const SideNavigation = () => {
  return (
    <div id="mySidenav" className="sidenav">
        <a href="#" className="closebtn" onClick={closeNav}>&times;</a>
        <a className="link-pages" href="/" onClick={createAdmin}>New Admin</a>
        <a className="link-pages" href="/">Settings</a>
        <br />
        <br />
        <a className="link-pages logout" href="#" onClick={logoutFromApplication}><strong>Logout</strong></a>
    </div>
  )
}

export default SideNavigation