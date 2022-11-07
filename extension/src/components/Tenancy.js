import { Link } from "react-chrome-extension-router";

const Tenancy = ({ name, subtitle, rent, bond, invoice }) => {
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
      <Link style={{ color: "#88CBB7", fontWeight: "bold", textOverflow: "elipsis", fontSize: 16, }}>{name}</Link>
      <p style={{ fontSize: 16, color: 'white' }}>{subtitle}</p>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flex: 1,
          alignItems: "center",
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
          alignItems: "center",
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
          alignItems: "center",
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
    </div>
  );
};

export default Tenancy;
