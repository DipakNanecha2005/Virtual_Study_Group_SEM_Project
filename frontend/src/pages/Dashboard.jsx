import React from 'react';
import Navbar from './Navbar'; // adjust the path based on your folder structure
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
    return (
        <div>
            <Navbar />

            {/* Main Dashboard Content */}
            <div className="container mt-5">
                <h2 className="mb-4">Welcome to Your Study Dashboard</h2>

                <div className="row">
                    <div className="col-md-4 mb-4">
                        <div className="card shadow">
                            <div className="card-body">
                                <h5 className="card-title">My Groups</h5>
                                <p className="card-text">View or manage your study groups.</p>
                                <a href="#" className="btn btn-primary">View Groups</a>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 mb-4">
                        <div className="card shadow">
                            <div className="card-body">
                                <h5 className="card-title">Messages</h5>
                                <p className="card-text">Check group chats and DMs.</p>
                                <a href="#" className="btn btn-success">Go to Messages</a>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 mb-4">
                        <div className="card shadow">
                            <div className="card-body">
                                <h5 className="card-title">Files & Resources</h5>
                                <p className="card-text">Access or upload shared files.</p>
                                <a href="#" className="btn btn-warning">Open Files</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-dark text-white text-center mt-5 py-3">
                <p className="mb-0">© {new Date().getFullYear()} Virtual Study Group. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Dashboard;
