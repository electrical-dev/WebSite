const Layout = ({ children }) => {
  return (
    <div className="flex flex-col items-center h-auto justify-center mt-24 mb-16 pb-10 ">
      {children}
    </div>
  );
};

export default Layout;
