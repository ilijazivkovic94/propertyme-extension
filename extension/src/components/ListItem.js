import { Link } from "react-chrome-extension-router";

const ListItem = ({ linkText, subText, subLink, rate, textLink, isSelf }) => {
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
        <Link style={{ color: "#88CBB7", fontWeight: "bold" }} onClick={() => {
          if (isSelf) {
            window.parent.location.href = textLink;
          } else {
            window.parent.postMessage({ link: textLink, type: 'open' }, 'https://app.propertyme.com');
          }
        }}>
          {linkText}
        </Link>
      </div>
      <div
        style={{
          display: "flex",
          flex: rate && rate[1] ? rate[1] : 1,
          fontSize: 16,
          color: "white",
          textAlign: "left",
        }}
      >
        {subLink ? (
          <Link style={{ color: "white", fontStyle: "italic" }} onClick={() => {
            if (isSelf) {
              window.parent.location.href = textLink;
            } else {
              window.parent.postMessage({ link: subLink, type: 'open' }, 'https://app.propertyme.com');
            }
          }}>
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
