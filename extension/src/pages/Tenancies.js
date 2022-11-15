import { useEffect, useState } from "react";
import Tenancy from "../components/Tenancy";
import { instance } from "../store/api";
import moment from 'moment';

const Tenancies = ({ id, properties, contacts }) => {
  const [isLoading, setLoading] = useState(false);
  const [tenancyList, setTenancyList] = useState([]);

  useEffect(() => {
    const getTenancies = () => {
      setLoading(true);
      instance.get("/lots?Timestamp=" + new Date().getTime()).then(async (res) => {
        let result = []
        if (id) {
          result = res.filter(r => r.Id === id);
        } else {
          result = res;
        }
        if (properties.length > 0) {
          result = res.filter(r => properties.includes(r.Id));
        }
        if (contacts.length > 0) {
          result = res.filter(r => contacts.includes(r.TenantContactId) || contacts.includes(r.OwnerContactId));
        }
        setTenancyList([...result]);
        for (let i = 0; i < result.length; i++) {
          const item = result[i];
          const detailData = await instance.get("/lots/" + item.Id + "/detail");
          result[i].Tenancy = detailData.Tenancy;
        };
        setLoading(false);
        setTenancyList([...result]);
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
          rent={`PAID TO - ${moment(item.EffectivePaidTo).format('ddd DD/MM/YY')}`}
          bond={(!item.Tenancy || item.Tenancy && item.Tenancy.BondArrears === 0) ? "PAID UP TO DATE" : "IN ARREARS - $" + (item.Tenancy?.BondArrears) + " OWING"}
          invoice={(!item.Tenancy || item.Tenancy && item.Tenancy.InvoiceArrears === 0) ? "NO PENDING INVOICES" : "INV - $" + item.Tenancy?.InvoiceArrears + " - " + item.Tenancy?.InvoiceDaysInArrears + "d ARREARS"}
          link={'https://app.propertyme.com/#/property/card/' + item.Id}
          id={item.Id}
        />
      ))}
    </div>
  );
};

export default Tenancies;
