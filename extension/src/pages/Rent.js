import Tasks from '../pages/Tasks';
import ListItem from '../components/ListItem';

const RENT = () => {
  const [rentList, setRentList] = useState([]);

  const getRentals = () => {
    instance.get("/lots/rentals?Offset=0&Limit=100").then((res) => {
      setRentList(res);
    });
  };

  useEffect(() => {
    getRentals();
  }, []);

  return (
    <div className="App">
      {rentList.map(item => (
        <ListItem
          linkText={"Rent"}
          link={Tasks}
          subText={`PAID TO - ${item.EffectivePaidTo}`}
        />
      ))}
      {rentList.length === 0 && <div style={{textAlign: 'center', color: 'grey', width: '100%' }}>No Rents</div>}
    </div>
  );
};

export default RENT;
