import { useEffect, useState } from "react";
import Tenancy from "../components/Tenancy";
import { instance } from "../store/api";

const Tenancies = ({ id, properties }) => {
  const [isLoading, setLoading] = useState(false);
  const [tenancyList, setTenancyList] = useState([]);

  useEffect(() => {
    const getTenancies = () => {
      setLoading(true);
      instance.get("/lots?Timestamp=" + new Date().getTime()).then((res) => {
        let result = []
        console.log(id);
        if (id) {
          result = res.filter(r => r.Id === id);
        } else {
          result = res;
        }
        let more = [];
        if (properties.length > 0) {
          more = res.filter(r => properties.includes(r.Id));
        }
        setTenancyList([...more, ...result]);
        setLoading(false);
        window.parent.postMessage(document.querySelector('#tenancy_list').scrollHeight);
      });
    };
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
          subtitle={item.TenantContactReference}
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
