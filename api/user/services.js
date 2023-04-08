const pool = require ("../../config/database");
const Paths= require("../helper/constants/Paths");
const enums=require(`../helper/constants/Enums`);
const helper=require(`../helper/helperfunctions`);

module.exports={

  post:(data,callback)=>{
    const randomNumber = Math.floor(Math.random() * 900000) + 100000;
    if(data.id===0)
    {
      const query = `INSERT INTO user(email, password, verification_code,code_generation_time,is_verified,action_type) VALUES (?, ?, ?, ?, ?, ?)`;
      
      pool.query(
        query,
        [
          data.email,
          data.password,
          randomNumber,
         // Paths.Paths.USER_IMAGE +"/"+ file.filename,
          new Date().toISOString().substring(0, 19).replace('T', ' '),
          0,
          1,
        ],
        (err, result) => 
        {
          if (err) 
          {
          return callback(err, null);
          }
            data.code=randomNumber;
            helper.sendingEmail(data);
          // console.log("query", result),  
          return callback(null, result);
        }
      )  
      }

    // if(data.id>0)
    // {
    //   const query=`select * from user where id = ?`;
    //   pool.query(
    //     query,
    //     [data.id],
    //     (err,result)=>
    //     {
    //       if(err)
    //       {
    //         return callback(err,null);
    //       }
    //       if(result==0)
    //       {
    //         return callback(null,result);
    //       }

    //       let query1="update user set "
    //       let values=[];
    //       let isFirst=true;
    //       if(data.email)
    //       {
    //         query1+=` email=?, `;
    //         values.push(data.email);
    //         isFirst=false;
    //       }
    //       if(data.page)
    //       {
    //         query+=`${isFirst ? ' ': ' '}password=?,`;
    //         values.push(data.password);
    //         isFirst=false;
    //       }
    //       if(data.){
    //         query+=`${isFirst ? ' ': ' '}Phone=?`;
    //         values.push(data.Phone);
    //         isFirst=false;
    //       }
    //   // if(file){
    //   //   query+=`${isFirst ? ' ': ' '}image_path=?`;
    //   //   values.push(Paths.Paths.USER_IMAGE+"/"+ file.filename);
    //   //   isFirst=false;
    //   // }
    //       query+=`where id=?`;
    //       values.push(data.id);

      
    //   pool.query(query, values, (err, result) => 
    //   {
    //       if (err) 
    //       {
    //           return callback(err);
    //       } else {
    //           return callback(null, result);
    //       }
    //   });





    //     }
    //   )
    // }
  },

  login:(data,callback)=>{
    pool.query(
      `select * from user where email=? and action_type<>3`,
      [
        data.email
      ],
      (err,result)=>{
        if(err){
          return callback(err,null);
        }
        if(result==0)
        {
          let finalResult={
            err_code:enums.NotFound.Email
          }
          return callback(null,finalResult);
        }
        pool.query(
          `select * from user where email=? and password=?`,
          [ 
            data.email,
            data.password
          ],
          (error,results)=>{
            if(error)
            {
              return callback(error,null);
            }
            if(results==0)
            {
              let finalResult={
                err_code:enums.NotFound.Password
              }
              return callback(null,finalResult);
            }
            pool.query(
              `select * from user where email=? and is_verified=1`,
              [
                data.email
              ],
              (error1,resultverify)=>{
                if(error1){
                  return callback(error1,null);
                }
                if(resultverify==0)
                {
                  let finalResult={
                    err_code:enums.ErrorCode.not_verified
                  }
                  return callback(null,finalResult);
                }
              
                pool.query(
                  `update user set logout=0 where email=?`,
                  [data.email],
                  (errorUpdate,resultUpdate)=>{
                    if(errorUpdate){
                      return callback(errorUpdate,null);
                    }
                    console.log("query update")
                    return callback(null,resultUpdate);
                  }
                )
              }
            )
          }
        )
      }
    )
  },

  logout:(data,callback)=>{
    data.mail="iqbalhamid380@gmail.com";
    data.code='01214';
    helper.sendingEmail(data);
    pool.query(
      `update user set logout=1 where email=?`,
      [data.email],
      (err,result)=>{
        if(err)
        {
          return callback(err,null);
        }
        return callback(null,result);
      }
    )
  },
  resetPassword:(data,callback)=>{
    pool.query(
      `select * from user where email=? and password=?`,
      [
        data.email,
        data.oldPassword,
      ],
      (err,result)=>
      {
        if(err){
          callback(err,null);
        }
        if(result==0)
        {
          let finalResult={
            err_code:enums.NotFound.Password
          }
          return callback(null,finalResult);
        }  
        pool.query(
          `update user set password=? where email=?`,
          [
            data.newPassword,
            data.email,
          ],
          (error,results)=>{
            if(error)
            {
              return callback(error,null);
            }
            return callback(null,results);
          }
        ) 
      }
    )
  },
  //...........generate verification code................
  generateVerificationCode:(data,callback)=>{
    const randomNumber = Math.floor(Math.random() * 900000) + 100000;
    pool.query(
      `update user set verification_code=?, code_generation_time=? where email=?`,
      [
        randomNumber,
        new Date().toISOString().substring(0,19).replace("T", " "),
        data.email,
      ],
      (err,result)=>{
        if(err)
        {
          return callback(err,null);
        }
        return callback(null,result)
      }
    )
  },

  verifyCode:(data,callback)=>{
    //checking is there user exist at this id?
      console.log(data.id);
      pool.query(
      `select * from user where email=?`,
      [data.email],
      (err,result)=>
      {
        if(err)
        {
          return callback(err,null);
        }
        if(result==0)
        {
          let finalResult={
            data:result,
            err_code:enums.NotFound.Email,
          }
          return callback(null,finalResult);
        }
        //matching verification code
        pool.query(
          `select * from user where email=? and verification_code=?` ,
          [
            data.email,
            data.verification_code,
            new Date().toISOString().substring(0,19).replace("T", " "),
          ],
          (error,results)=>{
            if(error)
            {
              return callback(error,null);
            }
            if(results==0)
            {
              let finalResult={
                data:results,
                err_code:enums.NotFound.Code,
              }
              return callback(null,finalResult);
            }
            const datetimeString = new Date(results[0].code_generation_time);
            const currentTime=new Date();
            const isWithin3Min =helper.timeDifference(currentTime,datetimeString);

            //.......If timer is expired...............
            if(isWithin3Min>=3)
            {
              const randomNumber = Math.floor(Math.random() * 900000) + 100000;
              pool.query(
                `update user set verification_code=?, code_generation_time=? where email=?`,
                [
                  randomNumber,
                  new Date().toISOString().substring(0,19).replace("T", " "),
                  data.email,
                ],
                (err,resut)=>{
                  if(err)
                  {
                    return callback(err,null);
                  }
                  let finalResult=
                  {
                     data:results,
                     err_code:enums.NotFound.Time,
                   }
                   data.code=randomNumber;
                   helper.sendingEmail(data);
                   return callback(null,finalResult);
                }
              )
            }
            else{
              //updating verified status
              pool.query(
                `update user set is_verified=1,verification_code=null,code_generation_time=null where email=?`,
                [data.email],
                (errors,resultUpdate)=>
                {
                  if(errors)
                  {
                    return callback(errors,null);
                  }
                  return callback(null,resultUpdate);
                }
                
              ) 
            }

          }
        )
      }
    )
  },

  forgetPassword:(data,callback)=>{
    pool.query(
      `select * from user where email=?`,
      [data.email],
      (err,result)=>{
        if(err)
        {
          return callback(err,null);
        }
        if(result==0)
        {
          let finalResult=
          {
             data:result,
             err_code:enums.NotFound.Email,
           }
         return callback(null,finalResult);
        }
        const randomNumber = Math.floor(Math.random() * 900000) + 100000;
        pool.query(
          `update user set verification_code=?, code_generation_time=? where email=?`,
          [
            randomNumber,
            new Date().toISOString().substring(0,19).replace("T", " "),
            data.email,
          ],
          (err,result)=>{
            if(err)
            {
              return callback(err,null);
            }
            data.code=randomNumber;
            helper.sendingEmail(data);
            return callback(null,result)
          }
        )
      }
    )
  },

  // signup 
  create: (data, file, callback) => {
      const query = `INSERT INTO user(Full_Name, Email, Phone,Created_On) VALUES (?, ?, ?, ?)`;
      
        pool.query(
          query,
          [
            data.Full_Name,
            data.Email,
            data.Phone,
           // Paths.Paths.USER_IMAGE +"/"+ file.filename,
            new Date().toISOString().substring(0, 19).replace('T', ' '),

          ],
          (err, result) => 
          {
            if (err) {
            return callback(err, null);
            }
            // console.log("query", result),  

            for(let i=0; i<file.length;i++)
            {
              pool.query(
                `INSERT INTO user_image(image_path,created_on,user_id) VALUES(?, ?, ?) `,
                [
                  Paths.Paths.USER_IMAGE+ "/" +file[i].filename,
                  new Date().toISOString().substring(0,19).replace(`T`,` `),
                  result.insertId,
                ],
                (error,results12345)=>{
                  if(error){
                   return  callback(error,null);
                  }
                  return callback(null,results12345);
                }
                )
            }
           
            //Code to show on post of what we have inserted using database 
            // pool.query(
            //     `Select * From user where id=?`,
            //     [
            //         result.insertId
            //     ],
            //     (Usererr, userResult)=>{
            //         if(Usererr) {
            //             return callback(Usererr, null);
            //         }
            //         return callback(null, userResult[0]);
            //     }hbhbah
            // )
          }
        );
  },

      //................Create User Image .........................
  createUserImage:(body,file,callback)=>{
        pool.query(
          `select * from user where id =?`,
          [body.user_id],
          (err,result)=>{
            if(err)
            {
              return callback(err,null);
            }
            if(result==0)
            {
              console.log("no result found at this user_id");
              return callback(null,result);
            }
            pool.query(
              `INSERT INTO user_image(image_path,created_on,user_id) VALUES(?, ?, ?) `,
              [
                Paths.Paths.USER_IMAGE+ "/" +file.filename,
                new Date().toISOString().substring(0,19).replace(`T`,` `),
                body.user_id,
              ],
              (error,results)=>{
                if(error){
                 return  callback(error,null);
                }
                 //Code to show on post of what we have inserted using database 
                 pool.query(
                  `Select * From user_image where id=?`,
                  [
                      results.insertId
                  ],
                  (Usererr, userResult)=>{
                      if(Usererr) {
                          return callback(Usererr, null);
                      }
                      return callback(null, userResult[0]);
                  }
            )
              }
              )
          }
        )
        
  },
//.................Get by Id...............//
  getUserById: (id, callback) => {
      pool.query(
        "select * from user where id=?",
        [
          id
        ],
        (err, result)=>{
          if (err){
            return callback(err,null);
          }
          else
          {
            return callback(null,result[0]);

          }
        }
      )
  },

   //.................Get All Users...............//
  getAllUsers: (body, callback) => {
  
  const startingLimit=(body.page-1)*body.limit;
  pool.query(
    `select * from user LIMIT ${startingLimit},${body.limit}`,
    [],
    (err, result)=>{
      if (err){
        return callback(err,null);
      }
      pool.query(
        `select count(*) from user `,
        [],
        (error,results)=>
        {
          if(error){
            return callback(error,null);
          }

          const data={
            users:result,
            totalCount:results[0]["count(*)"],
          }
          return callback(null,data);
        }
      )
    }
  )
  },
    //...............Update User.................
  updateUser:(data, callback) =>{
      let query= `update user set `;
      let values=[];
      let isFirst=true;
      if(data.Full_Name){
        query+=` Full_Name=?, `;
        values.push(data.Full_Name);
        isFirst=false;
      }
      if(data.Email){
        query+=`${isFirst ? ' ': ' '}Email=?,`;
        values.push(data.Email);
        isFirst=false;
      }
      if(data.Phone){
        query+=`${isFirst ? ' ': ' '}Phone=?`;
        values.push(data.Phone);
        isFirst=false;
      }
      // if(file){
      //   query+=`${isFirst ? ' ': ' '}image_path=?`;
      //   values.push(Paths.Paths.USER_IMAGE+"/"+ file.filename);
      //   isFirst=false;
      // }
      query+=`where id=?`;
      values.push(data.id);

      
      pool.query(query, values, (err, result) => 
      {
          if (err) 
          {
              return callback(err);
          } else {
              return callback(null, result);
          }
      });
    
  },


    //.................Update Images...................
  updateUserImage:(data,file,callback)=>{
      let query= `update user_image set `;
      let values=[];
      let isFirst =true;
      if(file)
      {
        query+=`image_path=? `;
        values.push(Paths.Paths.USER_IMAGE+`/`+file.filename);
        isFirst=false;
      }
      // query+=` created_on=? where id=? `;
      // values.push( new Date().toISOString().substring(0, 19).replace('T', ' '));
       query+=` where id=? `;
      values.push(data.id);
      pool.query(query, values, (err, result) => 
      {
          if (err) 
          {
              return callback(err);
          } else {
              return callback(null, result);
          }
      });
  },
    
    //................Delete User ................
  deleteUser:(id,callback)=>{
      pool.query(
        "delete from user where id=?",
        [id],
        (err,result)=>
        {
          if(err){
            return callback(err,null);
          }
          pool.query(
            `select * from user_image where user_id=?`,
            [id],
            (error,results)=>{
              if(error)
              {
                return callback(error,null);
              }
              if(results==0)
              {
                return callback(null,result);
              }
              pool.query(
                `delete from user_image where user_id=?`,
                [id],
                (errorDelete,resultDelete)=>{
                  if(errorDelete){
                    return callback(errorDelete,null);
                  }
                  return callback(null,resultDelete);
                }
              )
            }

          )
         // return callback(null,result);

        }
      )
  
  },

    // //.................Delete User Image.....................
  deleteUserImage:(id,callback)=>
     {
      pool.query(
        `delete from user_image where id=?`,
        [id],
        (err,result)=>{
          if(err)
          {
            return callback(err,null);
          }
          return callback(null,result);
        }
      )
  }
}