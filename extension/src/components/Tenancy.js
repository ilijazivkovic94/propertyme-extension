import { Link } from "react-chrome-extension-router";
import Rent from "../pages/Rent";
import Bond from "../pages/Bond";
import Invoice from "../pages/Invoice";
import { useCallback, useEffect, useState } from "react";
import Airtable from 'airtable';

const Tenancy = ({ name, subtitle, rent, bond, invoice, link, id }) => {
  const [airtableInfo, setAirtableInfo] = useState(null);
  const getAirtableInfo = useCallback(() => {
    let data = null;
    Airtable.configure({ apiKey: 'keySt4h4UcZG5EheK' })
    const table = new Airtable();
    const base = table.base('apppv94oLXw3EoJu7');
    const propertiesTable = base.table('Properties');
    propertiesTable.select().all().then(res => {
      const selected = res.find(item => item.fields.Id === id);
      if (selected) {
        setAirtableInfo(selected);
      }
    });
  }, [id]);

  useEffect(() => {
    getAirtableInfo();
  }, [id]);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        justifyContent: "center",
        padding: 10,
        borderBottom: "1px solid #88CBB7",
      }}
    >
      <Link
        style={{
          color: "#88CBB7",
          fontWeight: "bold",
          textOverflow: "elipsis",
          fontSize: 16,
        }}
        onClick={() => {
          window.parent.location.href = link;
        }}
      >
        {name}
      </Link>
      <p style={{ fontSize: 16, color: "white" }}>{subtitle}</p>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flex: 1,
          paddingTop: 10,
          paddingBottom: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            flex: 1,
            fontSize: 16,
          }}
        >
          <Link
            style={{ color: "#88CBB7", fontWeight: "bold" }}
          >
            Rent
          </Link>
        </div>
        <div
          style={{
            display: "flex",
            flex: 3,
            fontSize: 16,
            color: "white",
          }}
        >
          {rent}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flex: 1,
          paddingTop: 10,
          paddingBottom: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            flex: 1,
            fontSize: 16,
          }}
        >
          <Link
            style={{ color: "#88CBB7", fontWeight: "bold" }}
          >
            Bond
          </Link>
        </div>
        <div
          style={{
            display: "flex",
            flex: 3,
            fontSize: 16,
            color: "white",
          }}
        >
          {bond}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flex: 1,
          paddingTop: 10,
          paddingBottom: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            flex: 1,
            fontSize: 16,
          }}
        >
          <Link
            style={{ color: "#88CBB7", fontWeight: "bold" }}
          >
            Invoice
          </Link>
        </div>
        <div
          style={{
            display: "flex",
            flex: 3,
            fontSize: 16,
            color: "white",
          }}
        >
          {invoice}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flex: 1,
          paddingTop: 10,
          paddingBottom: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            flex: 1,
            fontSize: 16,
          }}
        >
          <Link
            style={{ color: "#88CBB7", fontWeight: "bold" }}
          >
            R: Drive
          </Link>
        </div>
        <Link
            style={{ 
              display: "flex",
              flex: 3,
              fontSize: 16,
              color: "#FFF",
              fontStyle: 'italic'
            }}
            onClick={() => {
              if (airtableInfo && airtableInfo.fields['R: Drive Folder Path']) {
                window.parent.postMessage({ link: airtableInfo.fields['R: Drive Folder Path'], type: 'modal' }, 'https://app.propertyme.com');
              }
            }}
          >
          {airtableInfo && airtableInfo.fields['R: Drive Folder Path'] ? 'CLICK HERE' : (airtableInfo && !airtableInfo.fields['R: Drive Folder Path'] ? 'NOT CONNECTED' : 'Connecting')} 
        </Link>
      </div>
    </div>
  );
};

export default Tenancy;
