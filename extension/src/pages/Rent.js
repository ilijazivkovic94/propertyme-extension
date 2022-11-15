import ListItem from "../components/ListItem";
import { useEffect, useState } from "react";
import { instance } from "../store/api";
import BackButton from "../components/BackButton";
import moment from 'moment';

const Rent = ({ id }) => {
  const [detailInfo, setDetailInfo] = useState(null);

  useEffect(() => {
    const getDetails = () => {
      instance.get("/lots/" + id + "/detail").then((res) => {
        setDetailInfo(res);
      });
    };
    getDetails();
  }, []);

  return (
    <div className="App">
      {detailInfo && detailInfo.Tenancy && detailInfo.Tenancy.PaidTo && (
        <ListItem
          linkText={"Rent"}
          subText={`PAID TO - ${moment(detailInfo?.Tenancy?.PaidTo).format('ddd DD/MM/YY')}`}
          textLink={"https://app.propertyme.com/#/property/card/" + id}
        />
      )}
      {detailInfo && detailInfo.Tenancy && detailInfo.Tenancy.RentArrears && (
        <ListItem
          linkText={"Rent"}
          subText={`$${detailInfo?.Tenancy?.RentArrears} IN ARREARS - ${detailInfo?.Tenancy?.RentArrearsByPeriod} DAYS`}
          textLink={"https://app.propertyme.com/#/property/card/" + id}
        />
      )}
      {!detailInfo && (
        <div style={{ textAlign: "center", color: "grey", width: "100%" }}>
          No Rents
        </div>
      )}
      <BackButton id={id} />
    </div>
  );
};

export default Rent;
