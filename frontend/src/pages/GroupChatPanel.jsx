// import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { Button, ListGroup } from 'react-bootstrap';
// import GroupDrawer from '../Elements/GroupDrawer';
// import { setSelectedChat, removeChat } from '../redux/chatSlice';

// const GroupChatPanel = () => {
//   const dispatch = useDispatch();
//   const chats = useSelector((state) => state.chat.chats);
//   const selectedChat = useSelector((state) => state.chat.selectedChat);
//   const currentUser = useSelector((state) => state.user.userInfo);

//   const [showModal, setShowModal] = useState(false);
//   const [editingGroup, setEditingGroup] = useState(null);

//   const openModal = (group = null) => {
//     setEditingGroup(group);
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setEditingGroup(null);
//     setShowModal(false);
//   };

//   const handleSelectChat = (chat) => {
//     dispatch(setSelectedChat(chat));
//   };

//   const handleDeleteChat = (chatId) => {
//     dispatch(removeChat(chatId));
//   };

//   // Only show group chats using isGroupChat from backend response
//   const groupChats = chats.filter(chat => chat.isGroupChat);

//   useEffect(() => {
//     const handleStorageChange = () => {
//       dispatch({ type: 'APP/LOCALSTORAGE_CHANGED' });
//     };

//     window.addEventListener('storage', handleStorageChange);
//     return () => {
//       window.removeEventListener('storage', handleStorageChange);
//     };
//   }, [dispatch]);

//   return (
//     <div className="p-4" style={{ backgroundColor: '#f4f6f9' }}>
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h5 style={{ color: '#343a40' }}>Group Chats</h5>
//         <Button
//           variant="success"
//           onClick={() => openModal()}
//           style={{ backgroundColor: '#007bff', borderColor: '#007bff' }}
//         >
//           + Create Group
//         </Button>
//       </div>

//       <ListGroup>
//         {groupChats.map((chat) => (
//           <ListGroup.Item
//             key={chat._id}
//             active={selectedChat?._id === chat._id}
//             onClick={() => handleSelectChat(chat)}
//             style={{
//               cursor: 'pointer',
//               backgroundColor: '#ffffff',
//               borderRadius: '8px',
//               marginBottom: '10px',
//               padding: '10px',
//               boxShadow: '0 1px 5px rgba(0,0,0,0.1)',
//             }}
//             className="d-flex justify-content-between align-items-center"
//           >
//             <div>
//               <strong style={{ color: '#007bff', fontSize: '16px' }}>
//                 {chat.name}
//               </strong>
//               <br />
//               <small className="text-muted">
//                 Created by: {chat.creator?.name || 'Unknown'}
//               </small>
//               <br />
//               <small className="text-muted">
//                 {chat.members?.length || 0} member{chat.members?.length !== 1 ? 's' : ''}
//               </small>
//             </div>

//             {chat.creator?._id === currentUser?._id && (
//               <div>
//                 <Button
//                   size="sm"
//                   variant="outline-primary"
//                   className="me-2"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     openModal(chat);
//                   }}
//                   style={{
//                     backgroundColor: '#f1f1f1',
//                     borderColor: '#007bff',
//                     color: '#007bff'
//                   }}
//                 >
//                   Edit
//                 </Button>
//                 <Button
//                   size="sm"
//                   variant="outline-danger"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleDeleteChat(chat._id);
//                   }}
//                   style={{
//                     backgroundColor: '#f8d7da',
//                     borderColor: '#dc3545',
//                     color: '#dc3545'
//                   }}
//                 >
//                   Delete
//                 </Button>
//               </div>
//             )}
//           </ListGroup.Item>
//         ))}
//       </ListGroup>

//       {showModal && (
//         <GroupChatModal
//           show={showModal}
//           closeModal={closeModal}
//           editingGroup={editingGroup}
//         />
//       )}
//     </div>
//   );
// };

// export default GroupChatPanel;
