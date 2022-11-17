import {instance} from '../store/api';
import Applications from './Applications';
import Rentals from './Rentals';
import Tasks from './Tasks';
import ListItem from '../components/ListItem';
import { useEffect, useState } from 'react';

const Home = ({ data }) => {
  const [jobsCount, setJobsCount] = useState(-1);
  const [tasksCount, setTasksCount] = useState(-1);

  const geJobsCounts = () => {
    instance.get('/session/raw').then(auth => {
      instance.get('/jobtasks?Timestamp=' + new Date().getTime()).then(res => {
        let counts = 0;
        if (auth && res) {
          const filtered = res.filter(item => item.TenantContactId === auth.MemberId || item.OwnerContactId === auth.MemberId || item.ManagerMemberId === auth.MemberId);
          if (filtered) {
            counts = filtered.length;
          }
        }
        setJobsCount(counts);
      })
    });
  }

  const geTasksCounts = () => {
    instance.get('/session/raw').then(auth => {
      instance.get('/tasks?Timestamp=' + new Date().getTime()).then(res => {
        let counts = 0;
        if (auth && res) {
          const filtered = res.filter(item => item.TenantContactId === auth.MemberId || item.OwnerContactId === auth.MemberId || item.ManagerMemberId === auth.MemberId);
          if (filtered) {
            counts = filtered.length;
          }
        }
        setTasksCount(counts);
      })
    });
  }

  useEffect(() => {
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
        isSelf={'true'}
      />
      <ListItem
        linkText={"Inbox"}
        link={Tasks}
        subText={(data.inbox ? data.inbox * 1 : 0) + " UNREAD"}
        textLink={"https://app.propertyme.com/#/message/inbox"}
        isSelf={'true'}
      />
      <ListItem
        linkText={"Outbox"}
        link={Tasks}
        subText={`${data.outbox ? data.outbox : 0} READY TO SEND`}
        textLink={"https://app.propertyme.com/#/message/list"}
        isSelf={'true'}
      />
      <ListItem
        linkText={"Bills"}
        link={Tasks}
        subText={`${data.bills ? data.bills : 0} WAITING APPROVAL`}
        textLink={"https://app.propertyme.com/#/bill/list"}
        isSelf={'true'}
      />
      <ListItem
        linkText={"Jobs"}
        link={Tasks}
        subText={`${jobsCount < 0 ? 0 : jobsCount} Active Jobs`}
        textLink={"https://app.propertyme.com/#/jobtask/list"}
        isSelf={'true'}
      />
      <ListItem
        linkText={"Leases Renewals"}
        link={Tasks}
        subText={"CLICK HERE"}
        subLink={"https://nsgorgau.sharepoint.com/:x:/r/sites/rentalsteam/_layouts/15/Doc.aspx?sourcedoc=%7B9349E6C9-66CE-4D05-8C12-D35A119387B1%7D&file=Lease%20Renewal%20Template.xlsx&action=default&mobileredirect=true&cid=fdca3f45-829b-41ce-8df4-a4f6059d0db0"}
        textLink={"https://nsgorgau.sharepoint.com/:x:/r/sites/rentalsteam/_layouts/15/Doc.aspx?sourcedoc=%7B9349E6C9-66CE-4D05-8C12-D35A119387B1%7D&file=Lease%20Renewal%20Template.xlsx&action=default&mobileredirect=true&cid=fdca3f45-829b-41ce-8df4-a4f6059d0db0"}
      />
      <ListItem
        linkText={"My Applications"}
        link={Applications}
        subText={"CLICK HERE"}
        subLink={"https://app.inspectrealestate.com.au/AppTracker2/Apps.aspx?menu=2"}
        textLink={"https://app.inspectrealestate.com.au/AppTracker2/Apps.aspx?menu=2"}
      />
      <ListItem
        linkText={"Aura Rentals"}
        link={Rentals}
        subText={"CLICK HERE"}
        subLink={"https://www.aurapropertysc.com.au/listings/?saleOrRental=Rental&type=Residential&order=dateListed-desc"}
        textLink={"https://www.aurapropertysc.com.au/listings/?saleOrRental=Rental&type=Residential&order=dateListed-desc"}
      />
    </div>
  );
};

export default Home;
