export const checkAuth = async (req,res,next)=>{
    try{
        return res.status(200).json({
            user : req.user
        });
    }catch(err){
        console.log("Error in check auth controller and error is",err.message);
        return res.status(500).json({
            message : err.message
        });
    }
}