import { Link } from "react-chrome-extension-router";

const ListItem = ({ linkText, link, subText, subLink, rate }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flex: 1,
        alignItems: "center",
        padding: 10,
        borderBottom: "1px solid #88CBB7",
      }}
    >
      <div
        style={{
          display: "flex",
          flex: rate && rate[0] ? rate[0] : 1,
          fontSize: 16,
        }}
      >
        <Link component={link} style={{ color: "#88CBB7", fontWeight: "bold" }}>
          {linkText}
        </Link>
      </div>
      <div
        style={{
          display: "flex",
          flex: rate && rate[1] ? rate[1] : 1,
          fontSize: 16,
          color: "white",
        }}
      >
        {subLink ? (
          <Link component={subLink} style={{ color: "white", fontStyle: "italic" }}>
            {subText}
          </Link>
        ) : (
          subText
        )}
      </div>
    </div>
  );
};

export default ListItem;
