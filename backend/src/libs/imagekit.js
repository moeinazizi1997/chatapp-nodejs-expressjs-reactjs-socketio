import ImageKit, {toFile} from "@imagekit/nodejs";

const imageKit = new ImageKit({privateKey : process.env.IMAGEKIT_PRIVATE_KEY});

export const hasImageKitConfig = ()=>{
    return Boolean(process.env.IMAGEKIT_PRIVATE_KEY);
};

const createFileName = (originalName="upload")=>{
    const safeName = originalName.replace("/[^a-zA-Z0-9._-]/g","_");
    return `chat-${Date.now()}-{safeName}`;
}

export const uploadChatMedia = async (file)=>{
    const fileName = createFileName(file.originalName);
    const result = await imageKit.files.upload({
        file : await toFile(file.buffer,fileName,{type : file.mimetype}),
        fileName,
        folder : "/chat"
    });

    return result.url;
};