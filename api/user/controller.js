const service = require("./services");
const common = require("../helper/common");
const messages= require("../helper/constants/Messages");
const Enums=require("../helper/constants/Enums");
module.exports ={


    post:(req,res)=>{
        const body=req.body;
        //console.log("inside controller");
        service.post(body,(err,result)=>{
            if(err){
                const data=common.error(err,messages.Messages.MSG_DB_CONNECTION_ERROR,Enums.ErrorCode.failed);
                return res.json({data});
            }
            const data=common.success(result,messages.Messages.MSG_SUCCESS,Enums.ErrorCode.success);
            return res.json({data});
        })
    },

    login:(req,res)=>{
        const body=req.body;
        service.login(body,(err,result)=>{
            if(err){
                const data=common.error(err,messages.Messages.MSG_DB_CONNECTION_ERROR,Enums.ErrorCode.failed);
                return res.json({data});
            }
            if(result.err_code==Enums.NotFound.Email)
            {
                const data=common.error(messages.Messages.MSG_EMAIL_NOT_FOUND_OR_USER_DELETED,Enums.ErrorCode.not_exist,);
                return res.json({data});
            }
            if(result.err_code==Enums.NotFound.Password){
                const data=common.error(messages.Messages.MSG_LOGIN_FAILED,Enums.ErrorCode.not_exist,);
                return res.json({data});
            }
            if(result.err_code==Enums.ErrorCode.not_verified){
                const data=common.error(messages.Messages.MSG_NOT_VERIFIED,Enums.ErrorCode.not_exist,);
                return res.json({data});
            }
            const data=common.success(result,messages.Messages.MSG_LOGIN_SUCCESS,Enums.ErrorCode.success);
            return res.json({data});
        })
    },

    logout:(req,res)=>{
        const body =req.body;
        service.logout(body,(err,result)=>{
            if(err){
                const data=common.error(err,messages.Messages.MSG_LOGOUT_FAILED,Enums.ErrorCode.failed);
                return res.json({data});
            }
            const data=common.success(result,messages.Messages.MSG_LOGOUT_SUCCESS,Enums.ErrorCode.success);
            return res.json({data});
        })
    },
    generateVerificationCode:(req,res)=>{
        const body=req.body;
        service.generateVerificationCode(body,(err,result)=>{
            if(err){
                const data=common.error(err,messages.Messages.MSG_DB_CONNECTION_ERROR,Enums.ErrorCode.failed);
                return res.json({data});
            }
            const data=common.success(result,messages.Messages.MSG_CODE_GENERATED_SUCCESSFULLY,Enums.ErrorCode.success);
            return res.json({data});
        })
    },

    resetPassword:(req,res)=>{
        const body=req.body;
        service.resetPassword(body,(err,result)=>{
            if(err){
                const data=common.error(err,messages.Messages.MSG_DB_CONNECTION_ERROR,Enums.ErrorCode.failed);
                return res.json({data});
            }else if(result.err_code==Enums.NotFound.Password)
            {
                const data=common.error(messages.Messages.MSG_INVALID_OLD_PASSWORD,Enums.ErrorCode.not_exist,);
                return res.json({data});
            } 
            const data=common.success(result,messages.Messages.MSG_UPDATE_PASSWORD_SUCCESS,Enums.ErrorCode.success);
            return res.json({data});
        })
    },

    forgetPassword:(req,res)=>{
        const body=req.body;
        service.forgetPassword(body,(err,result)=>{
            if(err){
                const data=common.error(err,messages.Messages.MSG_DB_CONNECTION_ERROR,Enums.ErrorCode.failed);
                return res.json({data});
            }
            if(result.err_code==Enums.NotFound.Email)
            {
                const data=common.error(err,messages.Messages.MSG_NO_RECORD,Enums.ErrorCode.not_exist);
                return res.json({data});
            }
            const data=common.success(result,messages.Messages.MSG_CODE_GENERATED_SUCCESSFULLY,Enums.ErrorCode.success);
            return res.json({data});
        })
    },
    verifyCode:(req,res)=>
    {
        const body=req.body;
        service.verifyCode(body,(err,result)=>{
            if(err){
                const data=common.error(err,messages.Messages.MSG_DB_CONNECTION_ERROR,Enums.ErrorCode.failed);
                return res.json({data});
            }else if(result.err_code==Enums.NotFound.Email)
            {
                const data=common.error(err,messages.Messages.MSG_NO_RECORD,Enums.ErrorCode.not_exist);
                return res.json({data});
            } else if(result.err_code==Enums.NotFound.Code)
            {
                const data=common.error(err,messages.Messages.MSG_INVALID_CODE,Enums.ErrorCode.not_exist);
                return res.json({data});
            }else if(result.err_code==Enums.NotFound.Time)
            {
                const data=common.error(err,messages.Messages.MSG_EXPIRED_CODE_AND_NEW_GENERATED,Enums.ErrorCode.not_exist);
                return res.json({data});
            }
            const data=common.success(result,messages.Messages.MSG_CODE_MATCHED_SUCCESSFULLY,Enums.ErrorCode.success);
            return res.json({data});
        })
    },


    createUser: (req, res)=>{
       const body = req.body;
       const file=req.files;
       service.create(body,file,(err,result)=>{
        if(err){
            const data=common.error(err,messages.Messages.MSG_DB_CONNECTION_ERROR,Enums.ErrorCode.failed);
           return res.json({data});
        }
        
        const data=common.success(result,messages.Messages.MSG_SUCCESS,Enums.ErrorCode.success);
        return res.json({data});
       });
    },

    //....................Create User Image .......................
    createUserImage:(req,res)=>{
        const body=req.body;
        const file=req.file;    
        service.createUserImage(body,file,(err,result)=>{
            if(err){
                const data=common.error(err,messages.Messages.MSG_DB_CONNECTION_ERROR,Enums.ErrorCode.failed);
               return res.json({data});
            }
            if(result==0)
            {
                const data=common.error(messages.Messages.MSG_NO_RECORD,Enums.ErrorCode.not_exist,);
                return res.json({data});
            }
            const data=common.success(result,messages.Messages.MSG_SUCCESS,Enums.ErrorCode.success);
            return res.json({data});
        })
    },
     //.......................Get User By ID...................
    getUserById:(req,res)=>
    {
       const id = req.query.id;
       service.getUserById(id,(err,result)=>
       {
        if (err)
        {
            const data=common.error(err,messages.Messages.MSG_INVALID_DATA,Enums.ErrorCode.failed);
            return res.json({data});
        }
        if(!result)
        {
            const data=common.error(messages.Messages.MSG_NO_RECORD,Enums.ErrorCode.not_exist,);
            return res.json({data});
        }
        const data=common.success(result,messages.Messages.MSG_CODE_MATCHED_SUCCESSFULLY,Enums.ErrorCode.success);
        return res.json({data});
       });  
    },

    //.......................Get All User...................

    getAllUsers:(req,res)=>
    {
        const body=req.body;
        if(!body.page||isNaN(body.page)||body.page<0)
        {
            body.page=1;
        }
        if(!body.limit||isNaN(body.limit)||body.limit<0)
        {
            body.limit=5;
        }
    service.getAllUsers(body,(err,result)=>
    {
        if (err)
        {
            const data=common.error(err,messages.Messages.MSG_INVALID_DATA,Enums.ErrorCode.failed);
            return res.json({data});
        }
        if(result==0)
        {
            const data=common.error(messages.Messages.MSG_NO_RECORD,Enums.ErrorCode.not_exist,);
            return res.json({data});
        }
 
        //call pagination here in place of success
        const data=common.pagination(result.users,result.totalCount,body.page,body.limit);
        return res.json({data});
    });  
    },

    //...........Update User.................
    
    updateUser:(req,res)=>{
        const body=req.body;
        service.updateUser(body,(err,result)=>{
            if(err){
                const data= common.error(err,messages.Messages.MSG_INVALID_DATA,Enums.ErrorCode.failed);
                return res.json({data});
            }
            if(result.affectedRows == 0)
            {
                const data=common.error(messages.Messages.MSG_NO_RECORD,Enums.ErrorCode.not_exist,);
                return res.json({data});
            }
            const data=common.success(result,messages.Messages.MSG_UPDATE_SUCCESS,Enums.ErrorCode.success);
            return res.json({data});
        });
    },


    //............................update User Image..............................
    updateUserImage:(req,res)=>{
        const body=req.body;
        const file=req.file;
        service.updateUserImage(body,file,(err,result)=>{
            if(err){
                const data= common.error(err,messages.Messages.MSG_INVALID_DATA,Enums.ErrorCode.failed);
                return res.json({data});
            }
            if(result.affectedRows == 0)
            {
                const data=common.error(messages.Messages.MSG_NO_RECORD,Enums.ErrorCode.not_exist,);
                return res.json({data});
            }
            const data=common.success(result,messages.Messages.MSG_UPDATE_SUCCESS,Enums.ErrorCode.success);
            return res.json({data});
        });
    },
    //...............Delete user..................

    deleteUser:(req,res)=>{
        const id= req.query.id;
        service.deleteUser(id,(err,result)=>
        {
            if(err)
            {
                const data=common.error(err,messages.Messages.MSG_INVALID_CODE,Enums.ErrorCode.failed);
                return res.json({data});
            }
            if(result.affectedRows == 0)
            {
                const data=common.error(err,messages.Messages.MSG_NO_RECORD,Enums.ErrorCode.exception,);
                return res.json({data});
            }
            const data=common.success(result,messages.Messages.MSG_DELETE_SUCCESS,Enums.ErrorCode.success);
            return res.json({data});
        })
    },

    deleteUserImage:(req,res)=>{
        const id=req.body.id;
        service.deleteUserImage(id,(err,result)=>{
            if(err){
                const data=common.error(err,messages.Messages.MSG_INVALID_CODE,Enums.ErrorCode.failed);
                return res.json({data});
            }
            if(result.affectedRows==0)
            {
                const data=common.error(err,messages.Messages.MSG_NO_RECORD,Enums.ErrorCode.exception,);
                return res.json({data});
            }
            const data=common.success(result,messages.Messages.MSG_DELETE_SUCCESS,Enums.ErrorCode.success);
            return res.json({data});
        });
    },

}