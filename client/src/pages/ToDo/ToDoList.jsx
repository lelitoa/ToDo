import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import styles from './ToDoList.module.css';
import { Button, Divider, Input, Modal, Select, Tag, Tooltip, message } from 'antd';
import { getErrorMessage } from '../../util/GetError';
import { getUserDetails } from '../../util/GetUser';
import ToDoServices from '../../services/toDoServices';
import { useNavigate } from 'react-router';
import { CheckCircleFilled, CheckCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
// import { set } from 'mongoose';

function ToDoList() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allToDo, setAllToDo] = useState([]);
  const [ currentEditItem, setCurrentEditItem] = useState("");
  const [ isEditing, setIsEditing] = useState(false);
  const [ updatedTitle, setUpdatedTitle] = useState("");
  const [ updatedDescription, setUpdatedDescription] = useState("");
  const [ updatedStatus, setUpdatedStatus] = useState("");

  const navigate = useNavigate();

  useEffect(()=>{
    let user = getUserDetails();

    const getAllToDo = async ()=> {
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
    if(user && user?.userId){
      getAllToDo();
    }else{
      navigate('/login');
    }

  },[navigate])

  const handleSubmitTask = async ()=> {
    setLoading(true);
    try {
      const userId = getUserDetails()?.userId;
      const data = {
        title,
        description,
        isCompleted: false,
        createdBy: userId
      }
      const response = await ToDoServices.createToDo(data);
      console.log(response.data);
      setLoading(false);
      message.success("To Do Task Added Successfully!");
      setIsAdding(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      message.error(getErrorMessage(err));
    }
  }

  const getFormattedDate = (value)=>{
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
    setIsEditing(true);             
  }

  const handleDelete = (item) => {
    console.log(item);
  }

  const handleUpdateStatus = (id) => {
    console.log(id);
  }

  const handleUpdateTask = async ()=> {
    try {
      const data = {
        title: updatedTitle,
        description: updatedDescription,
        isCompleted: updatedStatus
      }
      console.log(data);
    } catch (err) {
      console.log(err);
      message.error(getErrorMessage(err));
    }
  }

  return (
  <>
    <Navbar active={"myTask"} />
    <section className={styles.toDoWrapper}>
      <div className={styles.toDoHeader}>
        <h2>Your Tasks</h2>
        <Input style={{width: '50%'}} placeholder='Search Your Task Here...' />
        <div>
          <Button onClick={()=>setIsAdding(true)} type="primary" size="large">Add Task</Button>
        </div>
      </div>
      <Divider />

      <div className={styles.toDoListCardWrapper}>
        {allToDo.map((item)=>{
          return(
            <div key={item?._id} className={styles.toDoCard}>
              <div>
                <div className={styles.toDoCardHeader}>
                  <h3>{item?.title}</h3>
                  {item?.isCompleted ? <Tag color="cyan">Completed</Tag> : <Tag color="red">Incomplete</Tag>}
                </div>
                <p>{item?.description}</p>
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
        })}
      </div>
      
      <Modal confirmLoading={loading} title="Add New To Do Task" open={isAdding} onOk={handleSubmitTask} onCancel={()=>setIsAdding(false)}>
        <Input style={{marginBottom:'1rem'}} placeholder='Title' value={title} onChange={(e)=>setTitle(e.target.value)} />
        <Input.TextArea placeholder='Description' value={description} onChange={(e)=>setDescription(e.target.value)} />
      </Modal>

      <Modal confirmLoading={loading} title={`Update ${currentEditItem.title}`} open={isEditing} onOk={handleUpdateTask} onCancel={()=>setIsEditing(false)}>
        <Input style={{marginBottom:'1rem'}} placeholder='Updated Title' value={updatedTitle} onChange={(e)=>setUpdatedTitle(e.target.value)} />
        <Input.TextArea style={{marginBottom:'1rem'}} placeholder='Updated Description' value={updatedDescription} onChange={(e)=>setUpdatedDescription(e.target.value)} />
        
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
    </section>
  </>
)
}

export default ToDoList