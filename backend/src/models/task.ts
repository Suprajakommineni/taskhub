import mongoose from "mongoose";
export type TaskType = {
    _id: string;
    title: string;
    projectId: string;
    completed: boolean;
        priority: "Low" | "Medium" | "High";
    dueDate?: string;
};
const taskschema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    projectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project",
        required:true
    },
    priority: {
    type: String,
  enum: ["Low", "Medium", "High"],
  default: "Medium",
},
dueDate:{
    type: Date,
    required:false,
},


    completed:{
        type:Boolean,
        default:false
    }
})
const Task = mongoose.model<TaskType>("Task", taskschema);
export default Task;