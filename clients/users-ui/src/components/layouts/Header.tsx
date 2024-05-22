import styles from "../../utils/styles";
import NavItems from "./NavItems";
import ProfileDropDown from "./ProfileDropDown";

const Header = () => {
  return (
      <header className="w-full bg-[#42578A]">
      <div className="w-[90%] m-auto h-[80px] flex items-center justify-between">
        <h1 className={`${styles.logo}`}>Food Delivery Services</h1>
        <NavItems />
        <ProfileDropDown />
      </div>
    </header>
  );
}

export default Header