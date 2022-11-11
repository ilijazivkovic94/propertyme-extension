import ListItem from "../components/ListItem";
import { useEffect, useState } from "react";
import { instance } from "../store/api";
import BackButton from "../components/BackButton";

const Invoice = ({ id }) => {
  const [detailInfo, setDetailInfo] = useState(null);

  const getDetail = () => {
    instance.get("/lots/" + id + "/detail").then((res) => {
      setDetailInfo(res);
    });
  };

  useEffect(() => {
    getDetail();
  }, []);
  return (
    <div className="App">
      {!detailInfo && (
        <ListItem
          linkText={"Invoice"}
          subText={"NO PENDING INVOICES"}
          textLink={"https://app.propertyme.com/#/property/card/" + id}
        />
      )}
      {detailInfo && (
        <ListItem
          linkText={"Invoice"}
          textLink={"https://app.propertyme.com/#/property/card/" + id}
          subText={() => (
            <div>
              {detailInfo?.Tenancy?.InvoiceDaysInArrears && (
                <div>
                  INV - ${detailInfo?.Tenancy?.RentAmount} -{" "}
                  {detailInfo?.Tenancy?.InvoiceDaysInArrears}d ARREARS
                </div>
              )}
            </div>
          )}
        />
      )}
      <BackButton />
    </div>
  );
};

export default Invoice;
