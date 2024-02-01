const Layout = ({ children }) => {
  return (
    <div className="flex justify-between items-center h-screen ">
      {children}
    </div>
  );
};

export default Layout;
