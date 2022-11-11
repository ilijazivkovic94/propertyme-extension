import {instance} from '../store/api';
import Applications from './Applications';
import Rentals from './Rentals';
import Tasks from './Tasks';
import ListItem from '../components/ListItem';
import { useEffect, useState } from 'react';

const Home = ({ unread }) => {
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
      setJobsCount(res.DetailWidgets[0].Values[1].Quantity);
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
        subText={`${tasksCount < 0 ? 0 : tasksCount} OVERDUE`}
        textLink={"https://app.propertyme.com/#/task/list"}
      />
      <ListItem
        linkText={"Inbox"}
        link={Tasks}
        subText={(unread ? unread : 0) + " UNREAD"}
        textLink={"https://app.propertyme.com/#/message/inbox"}
      />
      <ListItem
        linkText={"Outbox"}
        link={Tasks}
        subText={`${outboxCount < 0 ? 0 : outboxCount} READY TO SEND`}
        textLink={"https://app.propertyme.com/#/message/list"}
      />
      <ListItem
        linkText={"Bills"}
        link={Tasks}
        subText={`${billsCount < 0 ? 0 : billsCount} WAITING APPROVAL`}
        textLink={"https://app.propertyme.com/#/bill/list"}
      />
      <ListItem
        linkText={"Jobs"}
        link={Tasks}
        subText={`${jobsCount < 0 ? 0 : jobsCount} Active Jobs`}
        textLink={"https://app.propertyme.com/#/jobtask/list"}
      />
      <ListItem
        linkText={"Leases Renewals"}
        link={Tasks}
        subText={"CLICK HERE"}
        subLink={"https://app.propertyme.com/#/property/list"}
        textLink={"https://app.propertyme.com/#/property/list"}
      />
      <ListItem
        linkText={"My Applications"}
        link={Applications}
        subText={"CLICK HERE"}
        subLink={"https://app.propertyme.com/#/property/list"}
        textLink={"https://app.propertyme.com/#/property/list"}
      />
      <ListItem
        linkText={"Aura Rentals"}
        link={Rentals}
        subText={"CLICK HERE"}
        subLink={"https://app.propertyme.com/#/property/list"}
        textLink={"https://app.propertyme.com/#/property/list"}
      />
    </div>
  );
};

export default Home;
