import jwt from 'jsonwebtoken';

export const generateToken =(payload,signature, expiresIn='1d')=>{

    if(expiresIn){
        const token = jwt.sign(payload,signature,{expiresIn});
        return token;
        
    }
    else{
        const token = jwt.sign(payload,signature);
        return token;
    }

}

export const verifyToken = (token,signature)=>{

    const decoded = jwt.verify(token,signature);

    return decoded;
}