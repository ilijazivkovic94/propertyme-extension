import Tasks from './Tasks';
import ListItem from '../components/ListItem';

const Bond = () => {
  return (
    <div className="App">
      <ListItem
        linkText={"Bond"}
        link={Tasks}
        subText={"PAID UP TO DATE"}
      />
      <ListItem
        linkText={"Bond"}
        link={Tasks}
        subText={"IN ARREARS - $160 OWING"}
      />
    </div>
  );
};

export default Bond;
