import React, { useState } from 'react';
import { Container, Row, Col, ListGroup, Form, Button, Card } from 'react-bootstrap';
import SideDrawer from '../Elements/SideDrawer';

const dummyUsers = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];

const dummyMessages = {
  1: [
    { from: 'Alice', text: 'Hey there!', time: '10:00 AM' },
    { from: 'You', text: 'Hi Alice!', time: '10:01 AM' },
  ],
  2: [
    { from: 'Bob', text: 'Yo!', time: '11:00 AM' },
    { from: 'You', text: 'What’s up Bob?', time: '11:01 AM' },
  ],
};

function Main() {
  const [selectedUser, setSelectedUser] = useState(dummyUsers[0]);
  const [messages, setMessages] = useState(dummyMessages);
  const [newMsg, setNewMsg] = useState('');

  const handleSend = () => {
    if (!newMsg.trim()) return;
    const newMessage = { from: 'You', text: newMsg, time: 'Now' };
    setMessages((prev) => ({
      ...prev,
      [selectedUser.id]: [...prev[selectedUser.id], newMessage],
    }));
    setNewMsg('');
  };

  return (
    <Container fluid className="p-4">
        <SideDrawer/>
      <Row>
        <Col md={4}>
          <Card>
            <Card.Header><b>Contacts</b></Card.Header>
            <ListGroup variant="flush">
              {dummyUsers.map((user) => (
                <ListGroup.Item
                  key={user.id}
                  action
                  active={selectedUser.id === user.id}
                  onClick={() => setSelectedUser(user)}
                >
                  {user.name}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>
        <Col md={8}>
          <Card>
            <Card.Header><b>Chat with {selectedUser.name}</b></Card.Header>
            <Card.Body style={{ height: '400px', overflowY: 'auto', background: '#f8f9fa' }}>
              {messages[selectedUser.id].map((msg, idx) => (
                <div
                  key={idx}
                  className={`d-flex ${msg.from === 'You' ? 'justify-content-end' : 'justify-content-start'} mb-2`}
                >
                  <div
                    className={`p-2 rounded ${msg.from === 'You' ? 'bg-primary text-white' : 'bg-light'}`}
                    style={{ maxWidth: '70%' }}
                  >
                    <div>{msg.text}</div>
                    <small className="text-muted">{msg.time}</small>
                  </div>
                </div>
              ))}
            </Card.Body>
            <Card.Footer>
              <Form className="d-flex" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
                <Form.Control
                  type="text"
                  placeholder="Type a message..."
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                />
                <Button variant="primary" className="ms-2" onClick={handleSend}>
                  Send
                </Button>
              </Form>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Main;
