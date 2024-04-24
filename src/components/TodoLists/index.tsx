import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { List, Button, Modal, Form, Input, Checkbox } from "antd";
import {
  deleteTask,
  editTask,
  toggleSelectedTask,
  deleteSelectedTasks,
  Task,
} from "../../features/tasks/tasksSlice";

const TodoLists: React.FC = () => {
  const [isModal, setIsModal] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task>({
    id: 0,
    name: "",
    description: "",
    checked: false,
    subtasks: [],
  });

  const [form] = Form.useForm();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const dispatch = useDispatch();

  const showEditModal = (task: Task) => {
    setCurrentTask(task);
    setIsModal(true);
    setTimeout(() => form.setFieldsValue(task), 0);
  };

  const handleDelete = (id: number) => {
    dispatch(deleteTask(id));
  };

  const handleEdit = (values: { name: string; description: string }) => {
    dispatch(editTask({ id: currentTask.id, ...values }));
    setIsModal(false);
  };

  const handleCheckboxChange = (taskId: number) => {
    dispatch(toggleSelectedTask(taskId));
  };

  const handleDeleteSelected = () => {
    dispatch(deleteSelectedTasks());
  };

  const renderTasks = (tasks: Task[], level = 0) => (
    <>
      <List
        size="large"
        bordered
        dataSource={tasks}
        renderItem={(task) => (
          <List.Item
            style={{
              display: "flex",
              alignItems: "left",
              justifyContent: "left",
              marginRight: "27px",
            }}
            actions={[
              <Button type="link" onClick={() => showEditModal(task)}>
                Edit
              </Button>,
              <Button type="link" onClick={() => handleDelete(task.id)}>
                Delete
              </Button>,
            ]}
          >
            <Checkbox
              checked={task.checked}
              onChange={() => handleCheckboxChange(task.id)}
            />
            <List.Item.Meta
              style={{
                textAlign: "left",
                marginLeft: "15px",
                minWidth: "100px",
              }}
              title={task.name}
              description={`${task.description}
              ${task.dueDate ? `Выполнить к: ${task.dueDate}` : ""}
              ${task.reminderDate ? `Напоминание: ${task.reminderDate}` : ""}`}
            />

            {task.subtasks &&
              task.subtasks.length > 0 &&
              renderTasks(task.subtasks, level + 1)}
          </List.Item>
        )}
      />
    </>
  );

  return (
    <>
      {renderTasks(tasks)}
      <Modal
        title="Edit Task"
        open={isModal}
        onCancel={() => setIsModal(false)}
        footer={null}
      >
        <Form
          initialValues={{
            name: currentTask.name,
            description: currentTask.description,
          }}
          onFinish={handleEdit}
          form={form}
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Please input the task name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            rules={[
              { required: true, message: "Please input the task description!" },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Save Changes
          </Button>
        </Form>
      </Modal>

      <Button
        style={{ justifyContent: "left" }}
        type="primary"
        onClick={handleDeleteSelected}
      >
        Delete Selected
      </Button>
    </>
  );
};

export default TodoLists;
