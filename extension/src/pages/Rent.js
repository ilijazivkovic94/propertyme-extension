import Tasks from '../pages/Tasks';
import ListItem from '../components/ListItem';

const RENT = () => {
  return (
    <div className="App">
      <ListItem
        linkText={"Rent"}
        link={Tasks}
        subText={"PAID TO - MON 14-11"}
      />
      <ListItem
        linkText={"Rent"}
        link={Tasks}
        subText={"$206 IN ARREARS - 5 DAYS"}
      />
    </div>
  );
};

export default RENT;
