import UserMenu from "./user-menu";
import Row from "./utils/row";

const Header = () => {
  return (
    <header className="w-full bg-black text-white p-4 fixed top-0 left-0 z-10">
      <Row className="max-w-7xl mx-auto justify-between">
        <h1 className="text-lg font-bold">Finance Tracker</h1>
        <UserMenu />
      </Row>
    </header>
  );
};

export default Header;
