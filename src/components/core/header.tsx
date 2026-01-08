"use client";

import Link from "next/link";
import UserMenu from "../user-menu";
import Row from "./row";

const Header = () => {
  return (
    <header className="w-full bg-black h-16 text-white p-4 fixed top-0 left-0 z-10">
      <Row className="max-w-5xl mx-auto justify-between items-center">
        <Link href="/transacoes">
          <h1 className="text-lg font-bold text-green-600">Finance Tracker</h1>
        </Link>
        <UserMenu />
      </Row>
    </header>
  );
};

export default Header;
