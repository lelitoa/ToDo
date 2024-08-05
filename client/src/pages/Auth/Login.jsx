import React, {useState} from 'react';
import styles from './Login.module.css';
import login from '../../assets/login.png';
import {Button, Input} from 'antd';
import {Link} from 'react-router-dom';
import AuthServices from '../../services/authServices';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const  handleSubmit = async ()=>{
        try{
            setLoading(true);
            let data = {
                username,
                password
            }
            const response = await AuthServices.loginUser(data);
            console.log(response.data);
            setLoading(false);
        } catch(err){
            console.log(err);
            setLoading(false);
        } 
    }

    return (    
    <div>
        <div className={styles.login__card}>
            <img src={login} alt=".."/>
            <h2>Login</h2>   
            <div className={styles.input__wrapper}>
                <Input 
                placeholder="Username" 
                value={username} 
                onChange={(e)=>setUsername(e.target.value)} />
            </div>
            <div className={styles.input__wrapper}>
                <Input.Password
                placeholder="Password" 
                value={password} 
                onChange={(e)=>setPassword(e.target.value)} />
            </div>
            <div className={styles.input_info}>
                New User? <Link to="/register">Register</Link>
            </div>
            <br></br>
            <Button loading={loading} type="primary" size="large" disabled={!username || !password} onClick={handleSubmit} >Login</Button>
        </div>
    </div>
    )
}

export default Login
