import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FichasPage from "./pages/FichasPage";

const AppRoutes = () => {
  return (
    <Router basename="/fichas-enmicadas">
        <Routes>
          <Route path="/" element={<FichasPage />} />
        </Routes>
      </Router>
  );
};

export default AppRoutes;