const Layout = ({ children }) => {
  return (
    <div className="flex justify-between items-center h-screen snap-y ">
      {children}
    </div>
  );
};

export default Layout;
