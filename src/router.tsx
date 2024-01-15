import { createBrowserRouter } from "react-router-dom";
import Root from "./component/Root";
import Home from "./routes/Home";
import Users from "./routes/User";
import NotFound from "./routes/NotFound";
import PostDetail from "./routes/PostDetail";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement:<NotFound />,
        children: [
            {
                path: "",
                element: <Home />,
            },
            {
                path: "post/:postPk",
                element: <PostDetail />,
            },
        ],
    },
]);

export default router;