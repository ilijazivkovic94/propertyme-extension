import Applications from './Applications';
import Rentals from './Rentals';
import Tasks from './Tasks';
import ListItem from '../components/ListItem';

const Home = () => {
  return (
    <div className="App">
      <ListItem
        linkText={"Tasks"}
        link={Tasks}
        subText={"23 OVERDUE"}
      />
      <ListItem
        linkText={"Inbox"}
        link={Tasks}
        subText={"9 UNREAD, 2 OPENED"}
      />
      <ListItem
        linkText={"Outbox"}
        link={Tasks}
        subText={"9 READY TO SEND"}
      />
      <ListItem
        linkText={"Bills"}
        link={Tasks}
        subText={"6 WAITING APPROVAL"}
      />
      <ListItem
        linkText={"Jobs"}
        link={Tasks}
        subText={"83 Active Jobs"}
      />
      <ListItem
        linkText={"Leases Renewals"}
        link={Tasks}
        subText={"CLICK HERE"}
        subLink={Applications}
      />
      <ListItem
        linkText={"My Applications"}
        link={Applications}
        subText={"CLICK HERE"}
        subLink={Applications}
      />
      <ListItem
        linkText={"Aura Rentals"}
        link={Rentals}
        subText={"CLICK HERE"}
        subLink={Rentals}
      />
    </div>
  );
};

export default Home;
