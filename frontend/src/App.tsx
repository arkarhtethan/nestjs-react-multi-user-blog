import { useState } from "react";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router";
import { Footer } from "./components/footer/footer";
import { Header } from "./components/header/header";
import { Spinner } from "./shared/loader";
import { Login, Register } from "./containers/auth";
import { myProfileService } from "./service/auth.service";
import { getToken } from "./service/localstorage.service";
import { login } from "./store/auth.slice";
import { PostDetail, Posts } from "./containers/post";
import PostsByUsername from "./containers/post/postsByUsername";
import PostsByCategory from "./containers/post/postsByCategory";


function App () {
  const token = getToken();
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useQuery(`profile-${token}`, myProfileService, {
    enabled: enabled,
    retryOnMount: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 2,
    onSuccess: (data: any) => {
      if (data.ok) {
        dispatch(login(data.user));
      }
      setLoading(false);
    },
    onError: () => {
      setLoading(false);
    }
  });
  if (token && !enabled) {
    setLoading(true);
    setEnabled(true)
  }

  if (loading) {
    return (<div className="h-screen flex items-center justify-center">
      <Spinner height={40} color={"#000"} />
    </div>);
  }

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex-grow bg-gray-100">
        <Routes>
          <Route path="/" element={<Posts />} />
          <Route path="/user/:slug" element={<PostsByUsername />} />
          <Route path="/category/:slug" element={<PostsByCategory />} />
          <Route path="/:id" element={<PostDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
