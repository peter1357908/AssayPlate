import { useState } from "react";
import TopBar from "../components/TopBar";
import AssayPlate from "../components/AssayPlate";

const Home = () => {
  const [currPlate, setCurrPlate] = useState({});
  const [isModified, setIsModified] = useState(false);

  const sharedProps = {
    currPlate, setCurrPlate, isModified, setIsModified
  }

  return (
    <div className="home-page">
      <TopBar {...sharedProps} />
      <AssayPlate {...sharedProps} />
    </div>
  );
};

export default Home;