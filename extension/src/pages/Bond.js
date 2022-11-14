import ListItem from "../components/ListItem";
import { useEffect, useState } from "react";
import { instance } from "../store/api";
import BackButton from "../components/BackButton";

const Bond = ({ id }) => {
  const [detailInfo, setDetailInfo] = useState(null);

  useEffect(() => {
    const getDetail = () => {
      instance.get("/lots/" + id + "/detail").then((res) => {
        setDetailInfo(res);
      });
    };
    getDetail();
  }, []);
  return (
    <div className="App">
      {detailInfo &&
        detailInfo.Tenancy &&
        detailInfo.Tenancy.BondArrears === 0 && (
          <ListItem
            linkText={"Bond"}
            subText={"PAID UP TO DATE"}
            textLink={"https://app.propertyme.com/#/property/card/" + id}
          />
        )}
      {detailInfo && detailInfo.Tenancy && detailInfo.Tenancy.BondAmount && (
        <ListItem
          linkText={"Bond"}
          subText={`IN ARREARS - $${
            detailInfo?.Tenancy?.BondAmount -
            detailInfo?.Tenancy?.OpenBondReceived
          } OWING`}
          textLink={"https://app.propertyme.com/#/property/card/" + id}
        />
      )}
      <BackButton id={id} />
    </div>
  );
};

export default Bond;
