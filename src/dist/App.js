"use strict";
exports.__esModule = true;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var react_query_1 = require("@tanstack/react-query");
var Header_1 = require("./components/Header");
var Home_1 = require("./views/Home");
var Transfer_1 = require("./views/Transfer");
require("antd/dist/antd.css");
var queryClient = new react_query_1.QueryClient();
function App() {
    return (react_1["default"].createElement(react_query_1.QueryClientProvider, { client: queryClient },
        react_1["default"].createElement("div", { className: "App" },
            react_1["default"].createElement(Header_1["default"], null),
            react_1["default"].createElement(react_router_dom_1.BrowserRouter, null,
                react_1["default"].createElement(react_router_dom_1.Routes, null,
                    react_1["default"].createElement(react_router_dom_1.Route, { path: '/', element: react_1["default"].createElement(Home_1["default"], null) }),
                    react_1["default"].createElement(react_router_dom_1.Route, { path: '/Transfer', element: react_1["default"].createElement(Transfer_1["default"], null) }))),
            react_1["default"].createElement(Home_1["default"], null))));
}
exports["default"] = App;
