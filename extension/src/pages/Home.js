import {instance} from '../store/api';
import Applications from './Applications';
import Rentals from './Rentals';
import Tasks from './Tasks';
import ListItem from '../components/ListItem';
import { useEffect, useState } from 'react';

const Home = () => {
  const [outboxCount, setOutboxCount] = useState(-1);
  const [billsCount, setBillsCount] = useState(-1);
  const [jobsCount, setJobsCount] = useState(-1);
  const [tasksCount, setTasksCount] = useState(-1);

  const getOutboxCounts = () => {
    instance.get('/dashboards/communications/Messages').then(res => {
      setOutboxCount(res.ValueWidgets[0].Quantity);
    });
  }

  const getBillsCounts = () => {
    instance.get('/dashboards/transactions/Bills').then(res => {
      setBillsCount(res.ValueWidgets[0].Quantity);
    });
  }

  const geJobsCounts = () => {
    instance.get('/dashboards/activities/Jobs').then(res => {
      setJobsCount(res.ValueWidgets[0].Quantity);
    });
  }

  const geTasksCounts = () => {
    instance.get('/dashboards/activities/Tasks').then(res => {
      setTasksCount(res.DetailWidgets[0].Values[2].Quantity);
    });
  }

  useEffect(() => {
    getOutboxCounts();
    getBillsCounts();
    geJobsCounts();
    geTasksCounts();
  }, []);

  return (
    <div className="App">
      <ListItem
        linkText={"Tasks"}
        link={Tasks}
        subText={`${tasksCount} OVERDUE`}
      />
      <ListItem
        linkText={"Inbox"}
        link={Tasks}
        subText={"9 UNREAD, 2 OPENED"}
      />
      <ListItem
        linkText={"Outbox"}
        link={Tasks}
        subText={`${outboxCount} READY TO SEND`}
      />
      <ListItem
        linkText={"Bills"}
        link={Tasks}
        subText={`${billsCount} WAITING APPROVAL`}
      />
      <ListItem
        linkText={"Jobs"}
        link={Tasks}
        subText={`${jobsCount} Active Jobs`}
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
