import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import styles from './ToDoList.module.css';
import { Button, Divider, Empty, Input, Modal, Select, Tag, Tooltip, message, DatePicker } from 'antd';
import { getErrorMessage } from '../../util/GetError';
import { getUserDetails } from '../../util/GetUser';
import ToDoServices from '../../services/toDoServices';
import { useNavigate } from 'react-router';
import { CheckCircleFilled, CheckCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import moment from 'moment';

function ToDoList() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allToDo, setAllToDo] = useState([]);
  const [currentEditItem, setCurrentEditItem] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [updatedUrl, setUpdatedUrl] = useState("");
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [updatedDueDate, setUpdatedDueDate] = useState(null);
  const [currentTaskType, setCurrentTaskType] = useState("incomplete");
  const [completedToDo, setCompletedToDo] = useState([]);
  const [inCompletedToDo, setInCompletedToDo] = useState([]);
  const [currentToDoTask, setCurrentToDoTask] = useState([]);
  const [filteredToDo, setFilteredToDo] = useState([]);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const navigate = useNavigate();

  const getAllToDo = async () => {
    try {
      let user = getUserDetails();

      console.log(user?.userId);
      const response = await ToDoServices.getAllToDo(user?.userId);
      console.log(response.data);
      setAllToDo(response.data);
    } catch (err) {
      console.log(err);
      message.error(getErrorMessage(err));
    }
  };

  useEffect(() => {
    let user = getUserDetails();

    const getAllToDo = async () => {
      try {
        console.log(user?.userId);
        const response = await ToDoServices.getAllToDo(user?.userId);
        console.log(response.data);
        setAllToDo(response.data);
      } catch (err) {
        console.log(err);
        message.error(getErrorMessage(err));
      }
    }
    if (user && user?.userId) {
      getAllToDo();
    } else {
      navigate('/login');
    }

  }, [navigate]);

  useEffect(() => {
    const incomplete = allToDo.filter((item) => item.isCompleted === false);
    const complete = allToDo.filter((item) => item.isCompleted === true);

    setInCompletedToDo(incomplete);
    setCompletedToDo(complete);

    if (currentTaskType === 'incomplete') {
      setCurrentToDoTask(incomplete);
    } else {
      setCurrentToDoTask(complete);
    }
  }, [allToDo, currentTaskType]);

  const handleSubmitTask = async () => {
    setLoading(true);
    try {
      const userId = getUserDetails()?.userId;
      const data = {
        title,
        description,
        url,
        isCompleted: false,
        createdBy: userId,
        dueDate: dueDate ? dueDate.toDate() : null
      }
      const response = await ToDoServices.createToDo(data);
      console.log(response.data);
      setLoading(false);
      message.success("To Do Task Added Successfully!");
      setIsAdding(false);
      getAllToDo();
    } catch (err) {
      console.log(err);
      setLoading(false);
      message.error(getErrorMessage(err));
    }
  }

  const getFormattedDate = (value) => {
    let date = new Date(value);
    let dateString = date.toDateString();
    let hh = date.getHours();
    let min = date.getMinutes();
    let ss = date.getSeconds();
    let finalDate = `${dateString} at ${hh}:${min}:${ss}`;
    return finalDate;
  }

  const handleEdit = (item) => {
    console.log(item);
    setCurrentEditItem(item);
    setUpdatedTitle(item?.title);
    setUpdatedDescription(item?.description);
    setUpdatedUrl(item?.url);
    setUpdatedStatus(item?.isCompleted);
    setUpdatedDueDate(item?.dueDate ? moment(item.dueDate) : null);
    setIsEditing(true);
  }

  const handleDelete = (item) => {
    setTaskToDelete(item);
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    try {
      // const response = await ToDoServices.deleteToDo(taskToDelete._id);
      message.success(`${taskToDelete.title} is Deleted Successfully`);
      getAllToDo();
      setIsDeleteModalVisible(false);
      setTaskToDelete(null);
    } catch (err) {
      message.error(getErrorMessage(err));
    }
  };

  const handleUpdateStatus = async (id, status) => {
    console.log(id);

    try {
      const response = await ToDoServices.updateToDo(id, { isCompleted: status });
      console.log(response.data);
      message.success("Task Status Updated Successfully!");
      getAllToDo();
    } catch (err) {
      console.log(err);
      console.log(getErrorMessage(err));
    }
  }

  const handleUpdateTask = async () => {
    try {
      setLoading(true);
      const data = {
        title: updatedTitle,
        description: updatedDescription,
        url: updatedUrl,
        isCompleted: updatedStatus,
        dueDate: updatedDueDate ? updatedDueDate.toDate() : null
      }
      console.log(data);
      const response = await ToDoServices.updateToDo(currentEditItem?._id, data);
      console.log(response.data);
      message.success(`${currentEditItem?.title} Updated Successfully!`);
      setLoading(false);
      setIsEditing(false);
      getAllToDo();
    } catch (err) {
      console.log(err);
      setLoading(true);
      message.error(getErrorMessage(err));
    }
  }

  const handleTypeChange = () => {
    // console.log(value);
    const value = currentTaskType === 'incomplete' ? 'complete' : 'incomplete';
    setCurrentTaskType(value);
    if (value === 'incomplete') {
      setCurrentToDoTask(inCompletedToDo);
    } else {
      setCurrentToDoTask(completedToDo);
    }
  }

  const handleSearch = (e) => {
    let query = e.target.value;
    let filteredList = allToDo.filter((item) => item.title.toLowerCase().match(query.toLowerCase()));

    console.log(filteredList);
    if (filteredList.length > 0 && query) {
      setFilteredToDo(filteredList);
    } else {
      setFilteredToDo([]);
    }
  }

  return (
  <>
    <Navbar active={"myTask"} />
    <section className={styles.toDoWrapper}>
      <div className={styles.toDoHeader}>
        <h2>Your Tasks</h2>
        <Input style={{ width: '50%' }} onChange={handleSearch} placeholder='Search Your Task Here...' />
        <div>
          <Button
            type='primary'
            style={{ padding: '20px' }}
            onClick={handleTypeChange}
          >
            {currentTaskType === 'incomplete' ? 'Show   Complete' : 'Show Incomplete'}
          </Button>
          <Button style={{ marginLeft: '10px'}} onClick={() => setIsAdding(true)} type="primary" size="large">Add Task</Button>
        </div>
      </div>
      <Divider />

      <div className={styles.toDoListCardWrapper}>
        {filteredToDo.length > 0 ? filteredToDo.map((item) =>
          {
            return(
              <div key={item?._id} className={styles.toDoCard}>
                <div>
                  <div className={styles.toDoCardHeader}>
                    <h3>{item?.title}</h3>
                    <Tooltip title={getFormattedDate(item?.createdAt)}>
                      <Tag color="blue">{item?.dueDate ? moment(item.dueDate).format('DD-MM-YYYY') : 'No Due Date'}</Tag>
                    </Tooltip>
                    {item?.isCompleted ? <Tag color="cyan">Completed</Tag> : <Tag color="red">Incomplete</Tag>}
                  </div>
                  <p>{item?.description}</p>
                  <p>{item?.url}</p>
                </div>
                <div className={styles.toDoCardFooter}>
                  <Tag>{getFormattedDate(item?.createdAt)}</Tag>
                  <div className={styles.toDoFooterAction}>
                    <Tooltip title="Edit Task?"><EditOutlined onClick={()=>handleEdit(item)} className={styles.actionIcon} /></Tooltip>
                    <Tooltip title="Delete Task?"><DeleteOutlined onClick={()=>handleDelete(item)} style={{color:'red'}} className={styles.actionIcon}/></Tooltip>
                    {item?.isCompleted ? <Tooltip title="Mark as Incomplete"><CheckCircleFilled onClick={()=>handleUpdateStatus(item._id,false)} style={{color:'green'}} className={styles.actionIcon} /></Tooltip> :<Tooltip title="Mark as Completed"><CheckCircleOutlined onClick={()=>handleUpdateStatus(item._id,true)} className={styles.actionIcon}/></Tooltip>}
                  </div>
                </div>  
            </div>
            )
          }) : currentToDoTask.length > 0 ? currentToDoTask.map((item) => 
            {
              return(
                <div key={item?._id} className={styles.toDoCard}>
                  <div>
                    <div className={styles.toDoCardHeader}>
                      <h3>{item?.title}</h3>
                      {item?.isCompleted ? <Tag color="cyan">Completed</Tag> : <Tag color="red">Incomplete</Tag>}
                    </div>
                    <p>{item?.description}</p>
                    <p>{item?.url}</p>
                  </div>
                  
                  <div className={styles.toDoCardFooter}>
                    {/* <Tag>{getFormattedDate(item?.createdAt)}</Tag> */}
                    <Tag>{item?.dueDate ? moment(item.dueDate).format('DD-MM-YYYY') : 'No Due Date'}</Tag>
                    <div className={styles.toDoFooterAction}>
                      <Tooltip title="Edit Task?"><EditOutlined onClick={()=>handleEdit(item)} className={styles.actionIcon} /></Tooltip>
                      <Tooltip title="Delete Task?"><DeleteOutlined onClick={()=>handleDelete(item)} style={{color:'red'}} className={styles.actionIcon}/></Tooltip>
                      {item?.isCompleted ? <Tooltip title="Mark as Incomplete"><CheckCircleFilled onClick={()=>handleUpdateStatus(item._id,false)} style={{color:'green'}} className={styles.actionIcon} /></Tooltip> :<Tooltip title="Mark as Completed"><CheckCircleOutlined onClick={()=>handleUpdateStatus(item._id,true)} className={styles.actionIcon}/></Tooltip>}
                    </div>
                  </div>
              </div>
              )
          }) :
            <div className={styles.noTaskWrapper}>
              <Empty/>
            </div>
        }
      </div>
      
      <Modal confirmLoading={loading}
        title="Add New To Do Task" 
        open={isAdding} onOk={handleSubmitTask} 
        onCancel={()=>setIsAdding(false)}>
        <Input 
          style={{marginBottom:'1rem'}} 
          placeholder='Title' 
          value={title} 
          onChange={(e)=>setTitle(e.target.value)}
        />
        <Input.TextArea 
          style={{marginBottom:'1rem'}}
          placeholder='Description'
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
        /> 
        <Input.TextArea
          style={{marginBottom:'1rem'}}
          placeholder='URL'
          value={url}
          onChange={(e)=>setUrl(e.target.value)}
        />
        <DatePicker
            style={{ width: '100%' }}
            onChange={(date) => setDueDate(date)}
            value={dueDate ? moment(dueDate) : null}
            placeholder="Select Due Date"
        />
      </Modal>  

      <Modal
      confirmLoading={loading}
      title={`Update ${currentEditItem.title}`}
      open={isEditing} onOk={handleUpdateTask}
      onCancel={()=>setIsEditing(false)}>
        <Input
          style={{marginBottom:'1rem'}}
          placeholder='Updated Title'
          value={updatedTitle}
          onChange={(e)=>setUpdatedTitle(e.target.value)}
        />
        <Input.TextArea
          style={{marginBottom:'1rem'}}
          placeholder='Updated Description'
          value={updatedDescription}
          onChange={(e)=>setUpdatedDescription(e.target.value)}
        />
        <Input.TextArea
          style={{marginBottom:'1rem'}}
          placeholder='Updated URL'
          value={updatedUrl}
          onChange={(e)=>setUpdatedUrl(e.target.value)}
        />
        <DatePicker
            style={{ width: '100%', marginBottom:'1rem'}}
            onChange={(date, dateString) => setUpdatedDueDate(date)}
            value={updatedDueDate ? moment(updatedDueDate) : null}
            placeholder="Select Due Date"
        />
        
        <Select
          onChange={(value)=>setUpdatedStatus(value)}
          value={updatedStatus}

          options={[
          {
            value: false,
            label: 'Not Completed',
          },
          {
            value: true,
            label: 'Completed',
          },
          ]}
        />
      </Modal>

      <Modal
          title={`Are you sure you want to delete "${taskToDelete?.title}"?`}
          visible={isDeleteModalVisible}
          onOk={confirmDelete}
          onCancel={() => setIsDeleteModalVisible(false)}
          okText="Delete"
          cancelText="Cancel"
        >
          <p>This action cannot be undone.</p>
        </Modal>
    </section>
  </>
)
}

export default ToDoList
