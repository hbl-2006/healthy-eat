const Navbar = () => {
    return (
        <nav className="navbar">
            <h1>Healthy Eat</h1>
            <div className="navbar-button">
                <a className="return" href="/dashboard">Dashboard</a>
                <a className="user-icon" href="/settings"></a>
            </div>
        </nav>
    );
}

export default Navbar;