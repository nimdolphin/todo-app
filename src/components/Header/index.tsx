import { Typography } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const { Title } = Typography;

const Header: React.FC = () => {
  const tasksCount = useSelector(
    (state: RootState) => state.tasks.tasks.length
  );

  return <Title level={3}>Todo list {tasksCount} task(s)</Title>;
};

export default Header;
