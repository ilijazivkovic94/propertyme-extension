import { useEffect, useState } from "react";
import Tenancy from "../components/Tenancy";
import { instance } from "../store/api";

const Tenancies = () => {
  const [isLoading, setLoading] = useState(false);
  const [tenancyList, setTenancyList] = useState([]);

  const getTenancies = () => {
    setLoading(true);
    instance.get("/lots?Timestamp=" + new Date().getTime()).then((res) => {
      setTenancyList(res);
      setLoading(false);
      window.parent.postMessage(document.querySelector('#tenancy_list').scrollHeight);
    });
  };

  useEffect(() => {
    getTenancies();
  }, []);
  return (
    <div id="tenancy_list">
      {isLoading && !tenancyList.length && (
        <div style={{ display: 'flex', flex: 1, textAlign: 'center', width: '100%', color: 'white', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>
      )}
      {tenancyList.map((item) => (
        <Tenancy
          name={item.Reference}
          subtitle={item.ManagerName}
          rent={`PAID TO - ${item.EffectivePaidTo}`}
          bond={"PAID UP TO DATE"}
          invoice={"NO PENDING INVOICES"}
          link={'https://app.propertyme.com/#/property/card/' + item.Id}
          id={item.Id}
        />
      ))}
    </div>
  );
};

export default Tenancies;
