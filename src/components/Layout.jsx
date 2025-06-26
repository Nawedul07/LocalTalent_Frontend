// src/components/Layout.jsx

const Layout = ({ children }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center", // center horizontally
        alignItems: "flex-start", // or "center" if vertical centering too
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#f9f9f9",
        padding: "2rem",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "2rem auto",
          padding: "1rem",
          minHeight: "calc(100vh - 80px)", // adjust based on Navbar height
          boxSizing: "border-box",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;

// const Layout = ({ children }) => {
//   return (
//     <>
//       {/* <Navbar /> */}
//       <div
//         style={{
//           maxWidth: "1000px",
//           margin: "2rem auto",
//           padding: "1rem",
//           minHeight: "calc(100vh - 80px)", // adjust based on Navbar height
//           boxSizing: "border-box",
//         }}
//       >
//         {children}
//       </div>
//     </>
//   );
// };

// export default Layout;
