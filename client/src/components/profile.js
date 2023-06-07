import { Person, Envelope, Telephone, PersonWorkspace } from "react-bootstrap-icons";

const Profile = ({ user }) => {
  return (
    <div className="d-flex flex-column">
      <div className="d-flex flex-row" style={{ paddingTop: 20 }}>
        <Person size={30} style={{ marginTop: 5 }} />
        <div className="p-2 text-left" style={{ fontSize: 20 }}>{user.name}</div>
        <div className="p-2 text-left" style={{ fontSize: 20 }}>{user.lastname}</div>
      </div>
      <div className="d-flex flex-row" style={{ paddingTop: 20 }}>
        <Envelope size={30} style={{ marginTop: 5 }} />
        <div className="p-2 text-left" style={{ fontSize: 20 }}>{user.username}</div>
      </div>
      <div className="d-flex flex-row" style={{ paddingTop: 20 }}>
        <Telephone size={30} style={{ marginTop: 5 }} />
        <div className="p-2 text-left" style={{ fontSize: 20 }}>{user.phone_number}</div>
      </div>
      <div className="d-flex flex-row" style={{ paddingTop: 20 }}>
        <PersonWorkspace size={30} style={{ marginTop: 5 }} />
        <div className="p-2 text-left" style={{ fontSize: 20 }}>{user.role}</div>
      </div>
    </div>
  );
};

export default Profile;