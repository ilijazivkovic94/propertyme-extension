import { useEffect, useState } from "react";
import Tenancy from "../components/Tenancy";
import { instance } from "../store/api";

const Tenancies = () => {
  const [tenancyList, setTenancyList] = useState([]);

  const getTenancies = () => {
    instance.get("/lots?Timestamp=" + new Date().getTime()).then((res) => {
      setTenancyList(res);
    });
  };

  useEffect(() => {
    getTenancies();
  }, []);
  return (
    <div>
      {tenancyList.map((item) => (
        <Tenancy
          name={item.Reference}
          subtitle={item.ManagerName}
          rent={`PAID TO - ${item.EffectivePaidTo}`}
          bond={"PAID UP TO DATE"}
          invoice={"NO PENDING INVOICES"}
        />
      ))}
      <Tenancy
        name={"14 St Quentin Avenue, Marooc..."}
        subtitle={"Tenant First Names displayed..."}
        rent={"PAID TO - MON 14/11/22"}
        bond={"PAID UP TO DATE"}
        invoice={"NO PENDING INVOICES"}
      />
      <Tenancy
        name={"14 St Quentin Avenue, Marooc..."}
        subtitle={"Tenant First Names displayed..."}
        rent={"PAID TO - MON 14/11/22"}
        bond={"PAID UP TO DATE"}
        invoice={"NO PENDING INVOICES"}
      />
      <Tenancy
        name={"14 St Quentin Avenue, Marooc..."}
        subtitle={"Tenant First Names displayed..."}
        rent={"PAID TO - MON 14/11/22"}
        bond={"PAID UP TO DATE"}
        invoice={"NO PENDING INVOICES"}
      />
    </div>
  );
};

export default Tenancies;
