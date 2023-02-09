import UploadForm from "@/components/UploadForm/UploadForm";
import React from "react";

async function UploadPage(ctx : any) {
    await fetch('http://localhost:5000', { cache: 'no-store' });
    let post = null;
    if (ctx.searchParams.postId) {
        const res = await fetch(`http://localhost:5000/posts/${ctx.searchParams.postId}`, { method: 'GET', cache: 'no-store' });
        post = await res.json();
    }
    return <UploadForm post={post}/>
}

export default UploadPage;
