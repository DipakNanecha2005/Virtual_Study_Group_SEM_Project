import React, { useState } from 'react';
import './Profile.css';

export default function ProfileCard() {
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState({
    name: 'Sharifatu Mubarak',
    username: 'sharifatu90',
    email: 'user@email.com',
    password: '********',
    bio: 'Lifelong learner and cultural enthusiast.',
    connections: 145,
    academicInterests: 'History, Anthropology, Literature',
    groupsCreated: 'Cultural Circle',
    groupsJoined: 'Heritage Club, Language Lovers',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="full-page-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-img-wrapper">
            {/* <img src="https://i.pinimg.com/736x/d1/2d/e8/d12de87e9f09dd7b1279bffe24bb6792.jpg" alt="Profile" /> */}
          </div>
          <h2>{data.name}</h2>
          <p className="verified">Verified</p>
        </div>

        <div className="profile-details">
          {Object.entries(data).map(([key, value]) => (
            <div className="detail-row" key={key}>
              <span className="label">{key.replace(/([A-Z])/g, ' $1')}:</span>
              {isEditing ? (
                <input
                  name={key}
                  value={value}
                  onChange={handleChange}
                />
              ) : (
                <span className="value">{value}</span>
              )}
            </div>
          ))}
        </div>
        <button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Save' : 'Edit Profile'}
        </button>
      </div>
    </div>
  );
}