import Header from "./components/Header";
import TaskInputForm from "./components/TaskInputForm";
import TodoLists from "./components/TodoLists";
import { Layout, Flex } from "antd";

const layoutStyle = {
  borderRadius: 8,
  overflow: "hidden",
  width: "calc(50% - 8px)",
  maxWidth: "calc(50% - 8px)",
};

function App() {
  return (
    <Flex
      gap="middle"
      wrap="wrap"
      justify="center"
      style={{ margin: "15px", textAlign: "center" }}
    >
      <Layout style={layoutStyle}>
        <Header />
        <TaskInputForm />
        <TodoLists />
      </Layout>
    </Flex>
  );
}

export default App;
