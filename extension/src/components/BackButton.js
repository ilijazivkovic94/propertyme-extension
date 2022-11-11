import { Link } from "react-chrome-extension-router";
import Tenancies from "../pages/Tenancies";

const BackButton = () => {
  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        marginTop: 15,
      }}
    >
        <Link component={Tenancies} style={{ color: "#88CBB7", fontWeight: "bold" }}>
            Back
        </Link>
    </div>
  );
};

export default BackButton;
