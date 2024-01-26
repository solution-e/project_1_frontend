import { createBrowserRouter } from "react-router-dom";
import Root from "./component/Root";
import Home from "./routes/Home";
import UserDetail from "./routes/UserDetail";
import NotFound from "./routes/NotFound";
import PostDetail from "./routes/PostDetail";
import UploadPost from "./routes/UploadPost";
import CategoryList from "./routes/CategoryList";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <NotFound />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "post/upload",
        element: <UploadPost />,
      },
      {
        path: "category/:categoryId/post",
        element: <Home />,
      },
      {
        path: "post/:postPk",
        element: <PostDetail />,
      },
      {
        path: "category/",
        element: <CategoryList />,
      },
      {
        path: "UserDetail/",
        element: <UserDetail />,
      },
    ],
  },
]);

export default router;
