const ToDo = require("../models/ToDoList");

exports.createToDo = async (req,res)=>{
    try{
        const data = req.body;
        const todo = new ToDo(data);
        const result = await todo.save();
        console.log(result);
        res.status(201).send({message: "Created New Task !"});
    }catch(err){
        console.log(err);
        res.status(err);
    }
}