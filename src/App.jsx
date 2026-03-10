import { ConfigProvider } from "antd";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/AppRouter";

// [UI ONLY] Global theme configuration for Ant Design v5
const themeConfig = {
  token: {
    colorPrimary: "#1677ff",
    colorSuccess: "#52c41a",
    colorWarning: "#faad14",
    colorError: "#ff4d4f",
    colorBgLayout: "#f5f5f5",
    colorBgContainer: "#ffffff",
    colorText: "#1a1a1a",
    colorTextSecondary: "#8c8c8c",
    borderRadius: 12,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
  components: {
    Card: {
      boxShadowTertiary: "0 2px 8px rgba(0,0,0,0.08)",
    },
    Button: {
      controlHeight: 40,
      paddingContentHorizontal: 24,
    },
    Table: {
      borderRadius: 12,
    },
  },
};

function App() {
  return (
    <ConfigProvider theme={themeConfig}>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

export default App;
