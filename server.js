
const express=require('express');
const dotenv=require('dotenv');
const path=require('path');
const multer=require('multer');
const bodyParser=require('body-parser');

const app=express();
dotenv.config();
const PORT=process.env.PORT||8800;
app.use(bodyParser.urlencoded({extended:true}));

// file uplod folder name
const UPlode='./UPlodes/';

const storage=multer.diskStorage({
    destination:(req,file,CB)=>{
        CB(null,UPlode)
    },
    filename:(req,file,CB)=>{
        const fileEX=path.extname(file.originalname);
        const newfile=file.originalname.replace(fileEX,'')
                                        .toLocaleLowerCase()
                                        .split(' ')
                                        .join('-')+"-"+ Date.now();
        CB(null,newfile+fileEX)
    }
})

const uplode=multer({
    storage:storage,
    limits:{
        fileSize:10000000,
    },
    fileFilter:(req,file,CB)=>{
        if(
            file.mimetype=='image/jpg'||
            file.mimetype=='image/jpeg'||
            file.mimetype=='image/png'
        ){
            CB(null,true)
        }else{
            CB( new Error('Only jpeg png or jpg allowad '))
        }
        
    }
})

app.post("/",uplode.single('avatar'),(req,res)=>{
    res.send('hello world ')
})

app.use((error,req,res,next)=>{
    if(error){
        if(error instanceof multer.MulterError){
            res.status(500).send('Uploding error')
        }else{
            res.status(500).send(error.message)
        console.log(error.message)
        }
        
        
    }else{
        res.status(500).send('This is a server side error ..!')
        console.log('This is a server side error..!')
    }
})
app.listen(PORT,()=>{
    console.log(`Server Run on http://localhost:${PORT}`);
})
