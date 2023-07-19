// Assets
import down from "../assets/angle-down-solid.svg";
import Image from "next/image";

const Sort = () => {
  return (
    <div className="sort">
      <div className="sort__select">
        <p>Select Your Genre</p>
        <Image src={down} alt="Dropdown" />
      </div>

      <div className="sort__select">
        <p>Select Your Dates</p>
        <Image src={down} alt="Dropdown" />
      </div>

      <div className="sort__select">
        <p>Select Your Distance</p>
        <Image src={down} alt="Dropdown" />
      </div>
    </div>
  );
};

export default Sort;
