"use client";

const Footer = () => {
  // const { user } = useAuth();

  // if (!user) return null;

  return (
    <footer className="w-full bg-black text-white h-8 fixed bottom-0 left-0 z-10 flex justify-end items-center px-4">
      <span className="text-xs font-bold opacity-30">v0.1 (MVP)</span>
    </footer>
  );
};

export default Footer;
