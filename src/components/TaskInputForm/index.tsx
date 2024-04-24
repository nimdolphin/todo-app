import React from "react";
import { Input, Button, Form, Row, Col, Select, DatePicker } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { addNewTask, addSubtask, Task } from "../../features/tasks/tasksSlice";

interface FormValues {
  parentId?: number | null;
  taskName: string;
  taskDescription: string;
  dueDate?: any;
  reminderDate?: any;
}

const disabledDate = (currentDate: any) => {
  return currentDate && currentDate < new Date().setHours(0, 0, 0, 0);
};

const disablePastTime = () => {
  const currentHour = new Date().getHours();
  const currentMinutes = new Date().getMinutes();
  return {
    disabledHours: () => range(0, currentHour),
    disabledMinutes: (selectedHour: number) => {
      if (selectedHour === currentHour) {
        return range(0, currentMinutes);
      }
      return [];
    },
  };
};

const range = (start: number, end: number) => {
  const result = [];
  for (let i = start; i <= end; i++) {
    result.push(i);
  }
  return result;
};

const TaskInputForm: React.FC = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  const handleAddTask = (values: FormValues) => {
    const { parentId, taskName, taskDescription, dueDate, reminderDate } =
      values;
    const newTask: Task = {
      id: Date.now(),
      name: taskName,
      description: taskDescription,
      checked: false,
      dueDate: dueDate ? dueDate.format("YYYY-MM-DD HH:mm:ss") : undefined,
      reminderDate: reminderDate
        ? reminderDate.format("YYYY-MM-DD HH:mm:ss")
        : undefined,
      subtasks: [],
    };
    if (parentId !== null && parentId !== undefined) {
      dispatch(addSubtask({ parentId, subtask: newTask }));
    } else {
      dispatch(addNewTask(newTask));
    }
    form.resetFields();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleAddTask}
      style={{ margin: "10px 20px" }}
    >
      <Row gutter={24} justify="center">
        <Col span={12}>
          <Form.Item
            label="Task Name"
            name="taskName"
            rules={[
              {
                required: true,
                message: "Please, enter the name of the task!",
              },
            ]}
          >
            <Input placeholder="Enter task name" />
          </Form.Item>
          <Form.Item
            label="Subtask (optional)"
            name="parentId"
            initialValue={null}
          >
            <Select allowClear placeholder="Add subtask (optional)">
              {tasks.map((task) => (
                <Select.Option key={task.id} value={task.id}>
                  {task.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Task description"
            name="taskDescription"
            rules={[
              {
                required: true,
                message: "Please enter task description",
              },
            ]}
          >
            <Input.TextArea placeholder="Enter task description" rows={1} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Due date"
            name="dueDate"
            rules={[{ required: false, message: "Select task due date" }]}
          >
            <DatePicker
              format="YYYY-MM-DD HH:mm:ss"
              disabledDate={disabledDate}
              showTime={disablePastTime()}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Task reminder"
            name="reminderDate"
            rules={[
              {
                required: false,
                message: "Select task reminder date and time!",
              },
            ]}
          >
            <DatePicker
              showTime={{
                disabledHours: () => disablePastTime().disabledHours(),
                disabledMinutes: disablePastTime().disabledMinutes,
              }}
              disabledDate={disabledDate}
              format="YYYY-MM-DD HH:mm:ss"
            />
          </Form.Item>
        </Col>
      </Row>
      <Button type="primary" htmlType="submit">
        Add Task
      </Button>
    </Form>
  );
};

export default TaskInputForm;
