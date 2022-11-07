import Tasks from './Tasks';
import ListItem from '../components/ListItem';

const Invoice = () => {
  return (
    <div className="App">
      <ListItem
        linkText={"Invoice"}
        link={Tasks}
        subText={"NO PENDING INVOICES"}
      />
      <ListItem
        linkText={"Invoice"}
        link={Tasks}
        subText={() => (
          <div>
            <div>INV - $160.23 - DUE 14-11</div>
            <div>INV - $160.23 - 5d ARREARS</div>
          </div>
        )}
      />
      <ListItem
        linkText={"Invoice"}
        link={Tasks}
        subText={"INV - $160.23 - 5d ARREARS"}
      />
    </div>
  );
};

export default Invoice;
