import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context";
import "bootstrap/dist/css/bootstrap.min.css";
import "./app.css";
import Login from "./pages/MustLogin/Login";
import Male from "./pages/MustLogin/Gender/Male";
import Female from "./pages/MustLogin/Gender/Female";
import Group from "./pages/MustLogin/Group/ListGroup";
import Generus from "./pages/MustLogin/Generus/Admin";
import DashboardAdmin from "./pages/MustLogin/Dashboard/Admin";
import DashboardVillage from "./pages/MustLogin/Dashboard/Village";
import DashboardKelompok from "./pages/MustLogin/Dashboard/Group";
import Kelompok from "./pages/MustLogin/Generus/Village";
import TokenChecker from "./CheckToken/TokenChecker";
import ErrorPage from "./pages/ErrorPage"; // Import halaman 404
import Profile from "./pages/MustLogin/Profile";
import Home from "./pages/Home";

const DashboardSelector = () => {
  const { userRole } = useAuth();

  const dashboardMap = {
    admin: <DashboardAdmin />,
    daerah: <DashboardAdmin />,
    desa: <DashboardVillage />,
    kelompok: <DashboardKelompok />,
  };

  return dashboardMap[userRole] || <Navigate to="/login" />;
};

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // Tampilkan loader sementara menunggu autentikasi selesai
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <TokenChecker />
      <Routes>
        {/* Home page doesn't check authentication */}
        <Route path="/" element={<Home />} />

        <Route
          path="/dashboard"
          element={
            isAuthenticated ? <DashboardSelector /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/male"
          element={isAuthenticated ? <Male /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/female"
          element={isAuthenticated ? <Female /> : <Navigate to="/login" />}
        />
        <Route
          path="/listgroup"
          element={isAuthenticated ? <Group /> : <Navigate to="/login" />}
        />
        <Route
          path="/generus"
          element={isAuthenticated ? <Generus /> : <Navigate to="/login" />}
        />
        <Route
          path="/group/:uuid"
          element={isAuthenticated ? <Kelompok /> : <Navigate to="/login" />}
        />
        {/* Add a wildcard route for 404 page */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


// import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
// import { useAuth } from "./context";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./app.css";
// import Login from "./pages/Login";
// import Male from "./pages/Gender/Male";
// import Female from "./pages/Gender/Female";
// import Group from "./pages/Group/Admin";
// import Generus from "./pages/Generus/Admin";
// import DashboardAdmin from "./pages/Dashboard/Admin";
// import DashboardVillage from "./pages/Dashboard/Village";
// import Kelompok from "./pages/Group/Village";

// const DashboardSelector = () => {
//   const { userRole } = useAuth();

//   switch (userRole) {
//     case "admin":
//       return <DashboardAdmin />;
//     case "desa":
//       return <DashboardVillage />;
//     case "kelompok":
//       return <Kelompok />;
//     default:
//       return <Navigate to="/login" />;
//   }
// };

// function App() {
//   const { isAuthenticated } = useAuth();

//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route
//           path="/"
//           element={
//             isAuthenticated ? <DashboardSelector /> : <Navigate to="/login" />
//           }
//         />
//         <Route
//           path="/login"
//           element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
//         />
//         <Route
//           path="/male"
//           element={isAuthenticated ? <Male /> : <Navigate to="/male" />}
//         />
//         <Route
//           path="/female"
//           element={isAuthenticated ? <Female /> : <Navigate to="/female" />}
//         />
//         <Route
//           path="/listgroup"
//           element={isAuthenticated ? <Group /> : <Navigate to="/listgroup" />}
//         />
//         <Route
//           path="/generus"
//           element={isAuthenticated ? <Generus /> : <Navigate to="/generus" />}
//         />
//         <Route
//           path="/group/:uuid"
//           element={isAuthenticated ? <Kelompok /> : <Navigate to="/login" />}
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

// import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
// import DashboardAdmin from "./pages/Dashboard/Admin";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./app.css";
// import Login from "./pages/Login";
// import Male from "./pages/Gender/Male";
// import { useAuth } from "./context";
// import Female from "./pages/Gender/Female";
// import Group from "./pages/Group/Admin";
// import Generus from "./pages/Generus/Admin";
// import DashboardVillage from "./pages/Dashboard/Village";
// import Kelompok from "./pages/Group/Village";

// function App() {
//   const { isAuthenticated, userRole } = useAuth();
//   return (
//     <BrowserRouter
//       future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
//     >
//       <Routes>

//         <Route
//           path="/"
//           element={
//             isAuthenticated ? (
//               userRole === "admin" ? (
//                 <DashboardAdmin />
//               ) : userRole === "desa" ? (
//                 <DashboardVillage />
//               ) : userRole === "kelompok" ? (
//                 <KelompokDashboard />
//               ) : userRole === "daerah" ? (
//                 <DaerahDashboard />
//               ) : (
//                 <Navigate to="/login" />
//               )
//             ) : (
//               <Navigate to="/login" />
//             )
//           }
//         />

//         <Route
//           path="/login"
//           element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
//         />

//         <Route path="/male" element={ isAuthenticated ? <Male /> : <Navigate to='/male'/> } />
//         <Route path="/female" element={ isAuthenticated ? <Female /> : <Navigate to='/female'/> } />
//         <Route path="/listgroup" element={ isAuthenticated ? <Group /> : <Navigate to='/listgroup'/>} />
//         <Route path="/generus" element={ isAuthenticated ? <Generus /> : <Navigate to='/generus'/> } />
//         <Route path="/generus" element={ isAuthenticated ? <Generus /> : <Navigate to='/generus'/> } />
//         <Route path="/group/:uuid" element={ <Kelompok />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;
