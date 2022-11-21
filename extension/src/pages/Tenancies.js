import { useEffect, useState } from "react";
import Tenancy from "../components/Tenancy";
import { instance } from "../store/api";
import moment from "moment";

let allTenancies = [];

const Tenancies = ({ id, properties, contacts, tenant_id }) => {
  const [isLoading, setLoading] = useState(false);
  const [tenancyList, setTenancyList] = useState([]);

  useEffect(() => {
    const getTenancies = () => {
      setLoading(true);
      instance
        .get("/lots?Timestamp=" + new Date().getTime())
        .then(async (res) => {
          console.log(id, tenant_id);
          let result = [];
          if (id) {
            result = res.filter((r) => r.Id === id);
          } else {
            result = res;
          }
          if (!id && tenant_id) {
            result = res.filter((r) => r.Id === tenant_id);
          }
          if (properties && properties.length > 0) {
            result = res.filter((r) => properties.includes(r.Id));
          }
          if (contacts.length > 0) {
            result = res.filter(
              (r) =>
                contacts.includes(r.TenantContactId) ||
                contacts.includes(r.OwnerContactId)
            );
          }
          allTenancies = [...result];
          setTenancyList([...result]);
          for (let i = 0; i < result.length; i++) {
            const item = result[i];
            const detailData = await instance.get(
              "/lots/" + item.Id + "/detail"
            );
            result[i].Tenancy = detailData.Tenancy;
            window.parent.postMessage(
              { detail: detailData, type: "invoice" },
              "https://app.propertyme.com"
            );
          }
          setLoading(false);
          allTenancies = [...result];
          setTenancyList([...result]);
        });
    };
    getTenancies();

    var eventMethod = window.addEventListener
      ? "addEventListener"
      : "attachEvent";
    var eventer = window[eventMethod];
    var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

    // Listen to message from child window
    eventer(messageEvent, async function (e) {
      if (e.data.type === 'invoice_result') {
        const tenancyIndex = allTenancies.findIndex(t => t.Id === e.data.id);
        console.log(tenancyIndex);
        console.log(e.data.id);
        console.log(allTenancies);
        if (tenancyIndex > -1) {
          allTenancies[tenancyIndex].invoices = e.data.data;
          setTenancyList([...allTenancies]);
        }
      }
    });
  }, []);

  var now = moment(new Date());

  return (
    <div id="tenancy_list">
      {isLoading && !tenancyList.length && (
        <div
          style={{
            display: "flex",
            flex: 1,
            textAlign: "center",
            width: "100%",
            color: "white",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Loading...
        </div>
      )}
      {tenancyList.map((item) => (
        <Tenancy
          name={item.Reference}
          subtitle={item.TenantContactReference}
          rent={item.Tenancy && item.Tenancy.RentArrears ? `$${item.Tenancy.RentArrears} IN ARREARS - ${item.Tenancy.ArrearsDays} DAYS` : `PAID TO - ${moment(item.EffectivePaidTo).format(
            "ddd DD/MM/YY"
          )}`}
          bond={
            !item.Tenancy || (item.Tenancy && item.Tenancy.BondArrears === 0)
              ? "PAID UP TO DATE"
              : "IN ARREARS - $" + item.Tenancy?.BondArrears + " OWING"
          }
          invoice={item.invoices && item.invoices.length > 0 ? (
            <div>
              {item.invoices.map(inv => (inv.DueDate >= moment().format('YYYY-MM-DD') ? 
                <p style={{ marginTop: 0, marginBottom: 0 }}>
                  INV - ${inv.Amount} - DUE {moment(inv.DueDate).format(
                    "DD/MM/YY"
                  )}
                </p>
                :
                <p style={{ marginTop: 0, marginBottom: 0 }}>
                  INV - ${inv.Amount} - {moment.duration(now.diff(moment(inv.DueDate))).asDays()} ARREARS
                </p>
              ))}
            </div>
          ) : 'PAID UP TO DATE'}
          link={"https://app.propertyme.com/#/property/card/" + item.Id}
          id={item.Id}
        />
      ))}
    </div>
  );
};

export default Tenancies;
