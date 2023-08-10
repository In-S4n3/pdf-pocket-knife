import { ModeToggle } from "./modeToogle";

const Navbar = () => {
  return (
    <div className="w-full p-5">
      <div className="flex justify-end">
        <ModeToggle />
      </div>
    </div>
  );
};

export default Navbar;
